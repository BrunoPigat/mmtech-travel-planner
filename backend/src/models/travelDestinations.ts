import Nedb from 'nedb';
import {TravelPlansDestinationsModel} from './travelPlansDestinations';
import {TravelPlans} from './travelPlans';
import {calculateDistance} from "../utils/distanceCalculator";

const db = new Nedb({
    filename: 'data/travel_destinations.db',
    autoload: true
});

export interface TravelDestination {
    _id?: string;
    index: number;
    title: string;
    travel_time_to_previous_destination: number;
    distance_to_previous_destination: number;
    travel_plan_id: string;
    lat: string;
    lng: string;
}

export class TravelDestinations {
    static async create(destination: TravelDestination): Promise<TravelDestination> {
        return new Promise(async (resolve, reject) => {
            db.insert(destination, async (err, newDoc: TravelDestination) => {
                if (err) return reject(err);

                resolve(newDoc);

                await TravelPlansDestinationsModel.create({
                    travel_plan_id: destination.travel_plan_id,
                    travel_destination_id: newDoc._id as string
                });

                await TravelDestinations.updateTravelPlanTotals(destination.travel_plan_id);
            });
        });
    }

    static async updateTravelPlanTotals(travelPlanId: string) {
        try {
            const destinations = await TravelDestinations.getByTravelPlanId(travelPlanId);

            const totalDistance = destinations.reduce((acc, dest) => acc + dest.distance_to_previous_destination, 0);
            const totalTravelTime = destinations.reduce((acc, dest) => acc + dest.travel_time_to_previous_destination, 0);

            await TravelPlans.update(travelPlanId, {
                total_distance: totalDistance,
                total_travel_time: totalTravelTime
            });
        } catch (err) {
            console.error('Error updating travel plan totals:', err);
        }
    }

    static async getById(id: string): Promise<TravelDestination | null> {
        return new Promise((resolve, reject) => {
            db.findOne({_id: id}, (err, doc) => {
                if (err) return reject(err);
                resolve(doc);
            });
        });
    }

    static async getAll(): Promise<TravelDestination[]> {
        return new Promise((resolve, reject) => {
            db.find({}, (err: Error, docs: any) => {
                if (err) return reject(err);
                resolve(docs);
            });
        });
    }

    static async update(id: string, updates: Partial<TravelDestination>): Promise<number> {
        return new Promise((resolve, reject) => {
            db.update({_id: id}, {$set: updates}, {}, (err, numReplaced) => {
                if (err) return reject(err);
                resolve(numReplaced);
            });
        });
    }

    static async delete(id: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                const destination = await TravelDestinations.getById(id);
                if (!destination) {
                    return reject(new Error('Destination not found'));
                }

                const numRemoved = await new Promise<number>((resolve, reject) => {
                    db.remove({_id: id}, {}, (err, numRemoved) => {
                        if (err) return reject(err);
                        resolve(numRemoved);
                    });
                });

                const travelPlanId = destination.travel_plan_id;

                await TravelPlansDestinationsModel.deleteByDestinationId(id);

                let remainingDestinations = await TravelDestinations.getByTravelPlanId(travelPlanId);

                remainingDestinations = remainingDestinations
                    .map(dest => {
                        if (dest.index > destination.index) {
                            return { ...dest, index: dest.index - 1 };
                        }
                        return dest;
                    });

                await Promise.all(remainingDestinations.map(dest =>
                    TravelDestinations.updateIndex(dest._id as string, dest.index)
                ));

                remainingDestinations.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

                for (let i = 0; i < remainingDestinations.length - 1; i++) {
                    const startDestination = remainingDestinations[i];
                    const endDestination = remainingDestinations[i + 1];

                    const start = { lat: parseFloat(startDestination.lat), lng: parseFloat(startDestination.lng) };
                    const end = { lat: parseFloat(endDestination.lat), lng: parseFloat(endDestination.lng) };

                    const { distance, duration } = await calculateDistance(start, end);

                    await Promise.all([
                        TravelDestinations.updateDistance(endDestination._id as string, distance),
                        TravelDestinations.updateDuration(endDestination._id as string, duration)
                    ]);
                }

                await TravelDestinations.updateTravelPlanTotals(travelPlanId);

                resolve(numRemoved);
            } catch (err) {
                reject(err);
            }
        });
    }

    static async updateIndex(id: string, newIndex: number): Promise<void> {
        return new Promise((resolve, reject) => {
            db.update({_id: id}, {$set: {index: newIndex}}, {}, (err, numReplaced) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    static async updateDistance(id: string, newDistance: number): Promise<number> {
        return new Promise((resolve, reject) => {
            db.update(
                { _id: id },
                { $set: { distance_to_previous_destination: newDistance } },
                {},
                (err, numReplaced) => {
                    if (err) return reject(err);
                    resolve(numReplaced);
                }
            );
        });
    }

    static async updateDuration(id: string, newDuration: number): Promise<number> {
        return new Promise((resolve, reject) => {
            db.update(
                { _id: id },
                { $set: { travel_time_to_previous_destination: newDuration } },
                {},
                (err, numReplaced) => {
                    if (err) return reject(err);
                    resolve(numReplaced);
                }
            );
        });
    }

    static async getByTravelPlanId(travelPlanId: string): Promise<TravelDestination[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const links = await TravelPlansDestinationsModel.getByPlanId(travelPlanId);
                const destinationIds = links.map(link => link.travel_destination_id);
                db.find({_id: {$in: destinationIds}}, (err: Error, docs: any) => {
                    if (err) return reject(err);
                    resolve(docs);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
