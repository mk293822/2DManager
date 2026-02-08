import { AppEvents } from "@/types/event-bus";

type Listener<T> = (payload: T) => void;

class EventBus<T extends Record<string, unknown>> {
	private events: {
		[K in keyof T]?: Listener<T[K]>[];
	} = {};

	emit<K extends keyof T>(name: K, payload: T[K]) {
		this.events[name]?.forEach((cb) => cb(payload));
	}

	off<K extends keyof T>(name: K, cb: Listener<T[K]>) {
		if (!this.events[name]) return;
		this.events[name] = this.events[name]!.filter((h) => h !== cb);
	}

	on<K extends keyof T>(name: K, cb: Listener<T[K]>) {
		this.events[name] ??= [];
		this.events[name]!.push(cb);

		return () => {
			this.events[name] = this.events[name]!.filter((l) => l !== cb);
		};
	}
}

export const eventBus = new EventBus<AppEvents>();
