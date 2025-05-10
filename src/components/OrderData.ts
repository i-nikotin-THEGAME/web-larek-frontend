import validate from 'validate.js';
import { IOrdersData } from '../types';
import { IEvents } from './base/events';
import { constraintsContacts, constraintsOrder } from '../utils/constants';

export class OrderData implements IOrdersData {
	protected payment: string;
	protected email: string;
	protected phone: string;
	protected address: string;
	protected total: number = 0;
	protected items: string[] = [];

	constructor(protected events: IEvents) {}

	set setPayment(orderPayment: string) {
		this.payment = orderPayment;
	}

	set setAddress(orderAddress: string) {
		this.address = orderAddress;
	}

	set setEmail(email: string) {
		this.email = email;
	}

	set setPhone(phone: string) {
		this.phone = phone;
	}

	set setTotal(total: number) {
		this.total = total;
	}

	get getTotal() {
		return this.total;
	}

	get payload() {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items,
		};
	}

	addItem(item: string): void {
		const hasItem = this.items.includes(item);
		if (!hasItem) {
			this.items.push(item);
			this.events.emit('basket:changed', { cardId: this.items });
		}
	}

	deleteItem(item: string | null): void {
		if (item === null) return;
		this.items = this.items.filter((i) => i !== item);
		this.events.emit('basket:changed', { cardId: this.items });
	}

	getItems(): string[] {
		return [...this.items];
	}

	checkOrderValidation(): boolean {
		const dataValidation = {
			address: this.address,
			payment: this.payment,
		};
		const isValid = !Boolean(validate(dataValidation, constraintsOrder));
		return isValid;
	}

	checkContactValidation(): boolean {
		const dataValidation = {
			email: this.email,
			phone: this.phone,
		};
		const isValid = !Boolean(validate(dataValidation, constraintsContacts));
		return isValid;
	}

	checkFieldOrder(): string {
		const errorMessagAddress = validate.single(
			this.address,
			constraintsOrder.address
		);
		const errorMessagPayment = validate.single(
			this.payment,
			constraintsOrder.payment
		);
		const result = [errorMessagAddress, errorMessagPayment];

		if (result) {
			const errorMessages = Object.values(result)
				.flat()
				.filter((message) => message)
				.join('. ');

			return errorMessages;
		} else {
			return '';
		}
	}
	checkFieldContact(): string {
		const errorMessagEmail = validate.single(
			this.email,
			constraintsContacts.email
		);
		const errorMessagPhone = validate.single(
			this.phone,
			constraintsContacts.phone
		);
		const result = [errorMessagEmail, errorMessagPhone];

		if (result) {
			const errorMessages = Object.values(result)
				.flat()
				.filter((message) => message)
				.join('. ');

			return errorMessages;
		} else {
			return '';
		}
	}

	clearOrder(): void {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.total = 0;
		this.items = [];
	}
}
