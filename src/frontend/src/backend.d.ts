import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Idea {
    id: bigint;
    title: string;
    createdAt: bigint;
    description: string;
    isFavorite: boolean;
    category: string;
}
export interface backendInterface {
    createIdea(title: string, description: string, category: string): Promise<Idea>;
    deleteIdea(id: bigint): Promise<void>;
    getAllIdeas(): Promise<Array<Idea>>;
    toggleFavorite(id: bigint): Promise<Idea>;
}
