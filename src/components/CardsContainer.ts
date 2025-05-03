import { Component } from "./base/Component";

interface ICardsContainer {
    catalog: HTMLElement[];
}

export class CardsContainer extends Component<ICardsContainer> {
    protected _catalog: HTMLElement;
    

    constructor(protected container: HTMLElement) {
        super(container)
    }

    set catalog(items: HTMLElement[]) {
        console.log('происходит событие', items)
        this.container.replaceChildren(...items);
    }
}