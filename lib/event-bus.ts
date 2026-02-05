type Listener<T> = (payload: T) => void;

class EventBus<T extends Record<string, unknown>> {
	private events: {
		[K in keyof T]?: Listener<T[K]>[];
	} = {};

	emit<K extends keyof T>(name: K, payload: T[K]) {
		this.events[name]?.forEach((cb) => cb(payload));
	}

	on<K extends keyof T>(name: K, cb: Listener<T[K]>) {
		this.events[name] ??= [];
		this.events[name]!.push(cb);

		return () => {
			this.events[name] = this.events[name]!.filter((l) => l !== cb);
		};
	}
}

export const eventBus = new EventBus();
