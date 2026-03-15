type CustomElementLifecycle = {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  adoptedCallback?(): void;
  attributeChangedCallback?(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void;
};

type CustomElement = HTMLElement & CustomElementLifecycle;

type CustomElementWithIndex = CustomElement & Record<string | symbol, unknown>;

function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

function isCustomElement(target: unknown): target is CustomElement {
  return target instanceof HTMLElement;
}

function isCustomElementWithIndex(
  target: unknown
): target is CustomElementWithIndex {
  return target instanceof HTMLElement;
}

function isResponse(
  value: unknown
): value is { state: string; data?: unknown; detailedError?: unknown } {
  return value !== null && typeof value === 'object' && 'state' in value;
}

export function dispatch(eventName: string) {
  return function <T extends (...args: unknown[]) => unknown>(
    target: T,
    _: ClassMethodDecoratorContext
  ): T {
    if (!isFunction(target)) {
      throw new Error(`@dispatch: 메서드에만 사용할 수 있어요.`);
    }

    return function (this: HTMLElement, ...args: unknown[]) {
      const response = target.apply(this, args);

      const handle = (result: unknown) => {
        if (isResponse(result) && result.state === 'success') {
          this.dispatchEvent(
            new CustomEvent(eventName, {
              detail: result.data,
              bubbles: true,
              composed: true,
            })
          );
        }
        return result;
      };

      if (response instanceof Promise) {
        return response.then(handle);
      }

      return handle(response);
    } as T;
  };
}

export function errorDispatch(eventName: string) {
  return <T extends (...args: unknown[]) => unknown>(
    target: T,
    _: ClassMethodDecoratorContext
  ): T => {
    if (!isFunction(target)) {
      throw new Error(`@errorDispatch: 메서드에만 사용할 수 있어요.`);
    }
    return function (this: HTMLElement, ...args: unknown[]) {
      const response = target.apply(this, args);

      const handle = (result: unknown) => {
        if (isResponse(result) && result.state === 'error') {
          this.dispatchEvent(
            new CustomEvent(eventName, {
              detail: { error: result.detailedError },
              bubbles: true,
              composed: true,
            })
          );
        }
        return result;
      };

      if (response instanceof Promise) {
        return response.then(handle);
      }

      return handle(response);
    } as T;
  };
}

export function on(eventName: string, selector?: string) {
  return (_: unknown, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function (this: unknown) {
      if (!isCustomElement(this)) {
        throw new Error(
          `@on: HTMLElement를 상속한 클래스에서만 사용할 수 있어요.`
        );
      }

      const originalConnected = this.connectedCallback?.bind(this);

      this.connectedCallback = () => {
        originalConnected?.();

        const target = selector ? this.querySelector(selector) : this;

        if (!isCustomElementWithIndex(this)) return;
        const handler = this[context.name];

        if (!isFunction(handler)) {
          throw new Error(`@on: '${String(context.name)}'이 함수가 아니에요.`);
        }

        target?.addEventListener(eventName, handler.bind(this));
      };
    });
  };
}
