export interface ICard {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface ICardPreview {
	cards: ICard[];
}

export interface IBasketItem {
	id: string;
	element: HTMLElement;
	price: number;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	cards: string[];
}

export interface IForm {
	getContact(contactData: TFormOrder | TFormContacts): void;
	checkValidation(
		date: Record<keyof (TFormOrder | TFormContacts), string>
	): boolean;
	action(collback: Function | null): void;
}

export type TBasketList = Pick<ICard, 'id' | 'title' | 'price'>;

export type TFormOrder = Pick<IOrder, 'payment' | 'address'>;

export type TFormContacts = Pick<IOrder, 'email' | 'phone'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
