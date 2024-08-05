import Nedb from 'nedb';

const db = new Nedb({
    filename: 'data/travel_plans_destinations.db',
    autoload: true
});

export interface TravelPlansDestinations {
    id?: string;
    travel_plan_id: string;
    travel_destination_id: string;
}

export class TravelPlansDestinationsModel {
    static async create(planDestination: TravelPlansDestinations) {
        return new Promise((resolve, reject) => {
            db.insert(planDestination, (err, newDoc) => {
                if (err) return reject(err);
                resolve(newDoc);
            });
        });
    }

    static async getByPlanId(planId: string): Promise<TravelPlansDestinations[]> {
        return new Promise((resolve, reject) => {
            db.find({ travel_plan_id: planId }, (err: Error, docs: TravelPlansDestinations[]) => {
                if (err) return reject(err);
                resolve(docs);
            });
        });
    }

    static async getByDestinationId(destinationId: string): Promise<TravelPlansDestinations | null> {
        return new Promise((resolve, reject) => {
            db.findOne({ travel_destination_id: destinationId }, (err, doc) => {
                if (err) return reject(err);
                resolve(doc || null);
            });
        });
    }

    static async delete(planId: string, destinationId: string) {
        return new Promise((resolve, reject) => {
            db.remove({ travel_plan_id: planId, travel_destination_id: destinationId }, {}, (err, numRemoved) => {
                if (err) return reject(err);
                resolve(numRemoved);
            });
        });
    }

    static async deleteByDestinationId(destinationId: string) {
        return new Promise((resolve, reject) => {
            db.remove({ travel_destination_id: destinationId }, { multi: true }, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }

    static async deleteByPlanId(planId: string) {
        return new Promise((resolve, reject) => {
            db.remove({ travel_plan_id: planId }, { multi: true }, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}
