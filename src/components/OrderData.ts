import validate, { result } from 'validate.js';
import { IOrdersData, TBaskeCompact, TFormContact, TFormOrder } from '../types';
import { IEvents } from './base/events';
import { constraintsContacts, constraintsOrder } from '../utils/constants';

export class OrderData implements IOrdersData {
	protected payment: string;
	protected email: string;
	protected phone: string;
	protected address: string;
	protected total: number;
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

	addItem(item: string): void {
		this.items.push(item);
	}

	deleteItem(item: string | null): void {
		if (item === null) return;

		this.items = this.items.filter((i) => i !== item);
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
		console.log()
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
}
