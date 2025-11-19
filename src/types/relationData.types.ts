export interface DatabaseRelationResponse {
	id: number;
	mal_id: number;
	relation_data: Relation[];
}

export interface RelationEntry {
	mal_id: number;
	type: string;
	name: string;
	url: string;
}

export interface Relation {
	relation: string;
	entry: RelationEntry[];
}

export interface JikanRelationsResponse {
	data: Relation[];
}
