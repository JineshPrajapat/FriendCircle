import { Document, Model, FilterQuery } from 'mongoose';
import 'colors';
  
function handleDatabaseError(operation: string, error: unknown): void {
    if (error instanceof Error) {
        throw new Error(`${operation} failed: ${error.message}`.bgRed);
    } else {
        throw new Error(`An unknown error occurred during the ${operation} operation.`);
    }
}

export async function create<T extends Document>(model: Model<T>, data: Partial<T>): Promise<T | null> {
    try {
        const entry = await model.create(data);
        return entry;
    } catch (error) {
        handleDatabaseError("create", error);
        return null;
    }
}

export async function findOne<T extends Document>(model: Model<T>, query: FilterQuery<T>): Promise<T | null> {
    try {
        return await model.findOne(query).exec();
    } catch (error) {
        handleDatabaseError('findOne', error);
        return null;
    }
}

export async function findOneAndUpdate<T extends Document>(model: Model<T>, query: FilterQuery<T>, updateData: Partial<T>): Promise<T | null> {
    try {
        const updatedDocument = await model.findOneAndUpdate(query, updateData, { new: true, upsert: true  });
        return updatedDocument;
    } catch (error) {
        handleDatabaseError('findOne', error);
        return null;
    }
}

export async function findOneById<T extends Document>(model: Model<T>, id: string): Promise<T | null> {
    try {
        return await model.findById(id).exec();
    } catch (error) {
        handleDatabaseError('findById', error);
        return null;
    }
}

export async function find<T extends Document>(model: Model<T>, query: FilterQuery<T>): Promise<T[]> {
    try {
        return await model.find(query).exec();
    } catch (error) {
        handleDatabaseError('find', error);
        return [];
    }
}

// Find all by IDs
export async function findAllById<T extends Document>(model: Model<T>, ids: string[]): Promise<T[]> {
    try {
        return await model.find({ _id: { $in: ids } }).exec();
    } catch (error) {
        handleDatabaseError('findAllById', error);
        return [];
    }
}

// Check if entry exists by query
export async function exists<T extends Document>(model: Model<T>, query: FilterQuery<T>): Promise<boolean> {
    try {
        const count = await model.countDocuments(query).exec();
        return count > 0;
    } catch (error) {
        handleDatabaseError('exists', error);
        return false;
    }
}

// Count entries based on query
export async function count<T extends Document>(model: Model<T>, query: FilterQuery<T>): Promise<number | null> {
    try {
        return await model.countDocuments(query).exec();
    } catch (error) {
        handleDatabaseError('count', error);
        return null;
    }
}

// Delete one entry by query
export async function deleteOne<T extends Document>(model: Model<T>, query: FilterQuery<T>): Promise<boolean> {
    try {
        const result = await model.deleteOne(query).exec();
        return result.deletedCount > 0;
    } catch (error) {
        handleDatabaseError('deleteOne', error);
        return false;
    }
}

// Delete one by ID
export async function deleteById<T extends Document>(model: Model<T>, id: string): Promise<boolean> {
    try {
        const result = await model.findByIdAndDelete(id).exec();
        return result !== null;
    } catch (error) {
        handleDatabaseError('deleteById', error);
        return false;
    }
}

// Delete multiple entries by query
export async function deleteAll<T extends Document>(model: Model<T>, query: FilterQuery<T>): Promise<boolean> {
    try {
        const result = await model.deleteMany(query).exec();
        return result.deletedCount > 0;
    } catch (error) {
        handleDatabaseError('deleteAll', error);
        return false;
    }
}

// Delete multiple entries by IDs
export async function deleteAllById<T extends Document>(model: Model<T>, ids: string[]): Promise<boolean> {
    try {
        const result = await model.deleteMany({ _id: { $in: ids } }).exec();
        return result.deletedCount > 0;
    } catch (error) {
        handleDatabaseError('deleteAllById', error);
        return false;
    }
}

// Replace an existing entry by ID
export async function replace<T extends Document>(model: Model<T>, id: string, data: Partial<T>): Promise<T | null> {
    try {
        const result = await model.findByIdAndUpdate(id, data, { new: true }).exec();
        return result;
    } catch (error) {
        handleDatabaseError('replace', error);
        return null;
    }
}
