export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    cards: ICard[]
}

export interface ICardPreview {
    cards: ICard[];
    preview: string | null;
}

export interface IBasketData {
    cards: TBasketList[];
    preview: string;
    getList(cardId: string): TBasketList;  
    addcard(cardId: ICard): void;
    deletecard(cardId: ICard, collback: Function | null): void;
    removecard(cardId: ICard[], collback: Function | null): void;
    totalPrice(cardId: ICard[], collback: Function | null): void
}

export interface IForm {
    getContact(contactData: TFormOrder | TFormContacts): void;
    checkValidation(date: Record<keyof (TFormOrder | TFormContacts), string>): boolean;
    action(collback: Function | null): void 
}

export type TBasketList = Pick<ICard, 'title' | 'price'>

export type TFormOrder = Pick<IOrder, 'payment' | 'address'>

export type TFormContacts = Pick<IOrder, 'email' | 'phone'> 

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}