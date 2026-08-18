import mongoose, { Model } from "mongoose";

interface FindOptions {
    select?: string;
    populate?: string;
    lean?: boolean;
    sort?: string | Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
}

export class DatabaseRepository<TRowDoc> {
    constructor(private model: Model<TRowDoc>) {}

    create(data: Partial<TRowDoc>) {
        return this.model.create(data);
    }

    findOne(filter: mongoose.QueryFilter<TRowDoc>, options: FindOptions = {}) {
        const query = this.model.findOne(filter);
        return this.applyOptions(query, options);
    }

    findById(id: string, options: FindOptions = {}) {
        const query = this.model.findById(id);
        return this.applyOptions(query, options);
    }

    findAll(
        filter: mongoose.QueryFilter<TRowDoc> = {},
        options: FindOptions = {},
    ) {
        const query = this.model.find(filter);
        return this.applyOptions(query, options);
    }

    updateOne(
        filter: mongoose.QueryFilter<TRowDoc>,
        update: mongoose.UpdateQuery<TRowDoc>,
        options?: Parameters<Model<TRowDoc>["updateOne"]>[2],
    ) {
        return this.model.updateOne(filter, update, options);
    }

    findByIdAndUpdate(
        id: string,
        update: mongoose.UpdateQuery<TRowDoc>,
        options: mongoose.QueryOptions = { new: true },
    ) {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    findOneAndUpdate(
        filter: mongoose.QueryFilter<TRowDoc>,
        update: mongoose.UpdateQuery<TRowDoc>,
        options: mongoose.QueryOptions = { new: true },
    ) {
        return this.model.findOneAndUpdate(filter, update, options);
    }

    deleteOne(filter: mongoose.QueryFilter<TRowDoc>) {
        return this.model.deleteOne(filter);
    }

    findByIdAndDelete(id: string) {
        return this.model.findByIdAndDelete(id);
    }

    private applyOptions(query: any, options: FindOptions) {
        const { select, populate, lean, sort, limit, skip } = options;

        if (select) query.select(select);
        if (populate) query.populate(populate);
        if (sort) query.sort(sort);
        if (limit) query.limit(limit);
        if (skip) query.skip(skip);
        if (lean) query.lean();

        return query;
    }
}
