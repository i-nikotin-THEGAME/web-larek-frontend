export abstract class Component<T> {
    constructor(protected readonly container: HTMLElement) {

    }

    render(data?: Partial<T>): HTMLElement {
        console.log('Рендерю данные',data, this)
        Object.assign(this as object, data ?? {});
        console.log('Рендерю данные2',this.container)
        return this.container;
    }
}