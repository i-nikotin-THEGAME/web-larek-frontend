export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface ICardsData {
	cards: ICard[];
	preview: string | null;
}

export interface IOrdersData {
	addItem(item: string): void;
	deleteItem(item: string | null): void;
	checkOrderValidation(data: TFormOrder): boolean;
	checkContactValidation(data: Record< keyof TFormContact, string>): boolean;
}

export type TCardFull = Pick<ICard, 'id' | 'title' | 'price' | 'image' | 'category' | 'description'>;

export type TBaskeCompact = Pick<ICard, 'id' | 'title' | 'price'>;

export type TFormOrder = Pick<IOrder, 'payment' | 'address'>;

export type TFormContact = Pick<IOrder, 'email' | 'phone'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
