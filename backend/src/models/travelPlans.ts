import Nedb from 'nedb';
import {TravelDestination, TravelDestinations} from "./travelDestinations";
import {TravelPlansDestinations, TravelPlansDestinationsModel} from "./travelPlansDestinations";

const db = new Nedb({
    filename: 'data/travel_plans.db',
    autoload: true
});

export interface TravelPlan {
    _id?: string;
    title: string;
    start_date: Date;
    end_date: Date;
    user_id?: string;
    total_distance: number;
    total_travel_time: number;
}

export class TravelPlans {
    static async create(plan: TravelPlan, userId: string) {
        return new Promise((resolve, reject) => {
            // Add user_id to the plan object
            const planWithUserId = { ...plan, user_id: userId };
            db.insert(planWithUserId, (err, newDoc) => {
                if (err) return reject(err);
                resolve(newDoc);
            });
        });
    }

    static async getById(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const plan = await new Promise<TravelPlan | null>((resolve, reject) => {
                    db.findOne({_id: id}, (err, doc) => {
                        if (err) return reject(err);
                        resolve(doc);
                    });
                });

                if (!plan) {
                    return resolve(null);
                }

                const links = await TravelPlansDestinationsModel.getByPlanId(id);
                const destinationIds = links.map((link: TravelPlansDestinations) => link.travel_destination_id);
                const fetchedDestinations = await Promise.all(destinationIds.map((id: string) => TravelDestinations.getById(id)));

                const destinations = fetchedDestinations.filter((dest): dest is TravelDestination => dest !== null);

                resolve({...plan, destinations});
            } catch (err) {
                reject(err);
            }
        });
    }


    static async getAll(userId: string): Promise<(TravelPlan & { destinations: TravelDestination[] })[]> {
        return new Promise(async (resolve, reject) => {
            try {
                db.find({ user_id: userId }, async (err: Error, plans: TravelPlan[]) => {
                    if (err) return reject(err);

                    const plansWithDestinations = await Promise.all(plans.map(async (plan) => {
                        try {
                            const links: TravelPlansDestinations[] = await TravelPlansDestinationsModel.getByPlanId(plan._id as string);
                            const destinationIds: string[] = links.map((link: TravelPlansDestinations) => link.travel_destination_id);

                            const fetchedDestinations = await Promise.all(destinationIds.map((id: string) => TravelDestinations.getById(id)));
                            const destinations = fetchedDestinations.filter((dest): dest is TravelDestination => dest !== null);

                            const sortedDestinations = destinations.sort((a, b) => Number(a.index) - Number(b.index));

                            return { ...plan, destinations: sortedDestinations };
                        } catch (err) {
                            reject(err);
                            return { ...plan, destinations: [] };
                        }
                    }));

                    resolve(plansWithDestinations);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static async update(id: string, updates: Partial<TravelPlan>) {
        return new Promise((resolve, reject) => {
            db.update({_id: id}, {$set: updates}, {}, (err, numReplaced) => {
                if (err) return reject(err);
                resolve(numReplaced);
            });
        });
    }

    static async delete(id: string) {
        return new Promise((resolve, reject) => {
            db.remove({_id: id}, {}, (err, numRemoved) => {
                if (err) return reject(err);
                resolve(numRemoved);
            });
        });
    }
}
