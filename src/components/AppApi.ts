import { IApi, ICard, IOrder } from '../types';
import { ApiListResponse } from './base/api';
import { CDN_URL } from '../utils/constants';

export class AppApi {
	private _baseApi: IApi;
	readonly cdn: string

	constructor(cdn: string, baseApi: IApi) {
		this._baseApi = baseApi;
		this.cdn = cdn
	}

	getCards(): Promise<ICard[]> {
		return this._baseApi.get<ApiListResponse<ICard>>(`/product`).then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
		);
	}

	postOrder(data: IOrder): Promise<IOrder> {
		return this._baseApi.post<IOrder>(`/order`, data).then((res: IOrder) => res);
	}
}
