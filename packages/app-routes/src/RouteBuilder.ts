import * as t from 'io-ts';
import qs from 'querystring';

type QueryParamFieldCodec =
  | t.Type<any, string | number>
  | t.NullC
  | t.UndefinedC;
type QueryParamsUnitProps = {
  [key: string]: QueryParamFieldCodec;
};
type QueryParamsCodec = t.TypeC<QueryParamsUnitProps>;
type QueryParams = t.TypeOf<QueryParamsCodec>;

type SegmentPart<N extends string> = {
  type: 'segment';
  segment: N;
};
type RouteParamPart<N extends string, A> = {
  type: 'routeParam';
  name: N;
  codec: t.Type<A, string | number>;
};

type RoutePart = SegmentPart<any> | RouteParamPart<string, any>;

export interface LinkedNode<V, P = null> {
  value: V;
  prev: P;
}

type Append<V, P extends LinkedNode<any, any>> = LinkedNode<V, P>;

type LinkedList<T> = LinkedNode<'head'> | LinkedNode<T, LinkedList<T>>;

type RouteParts = LinkedList<RoutePart>;

type TemplateStringOfPart<T extends RoutePart> = T extends SegmentPart<any>
  ? `/${T['segment']}`
  : T extends RouteParamPart<any, any>
  ? `/:${T['name']}`
  : '';

type TemplateOfHelper<R extends RouteParts> = R['value'] extends RoutePart
  ? R['prev'] extends RouteParts
    ? `${TemplateOfHelper<R['prev']>}${TemplateStringOfPart<R['value']>}`
    : `${TemplateStringOfPart<R['value']>}`
  : '';

type TemplateOf<R extends RouteParts> = R['prev'] extends null
  ? '/'
  : TemplateOfHelper<R>;

type RouteParamFillArgsOfRoutePartNode<T extends RouteParts> =
  T['value'] extends RouteParamPart<any, any>
    ? {
        [key in T['value']['name']]: t.TypeOf<T['value']['codec']>;
      }
    : null;

type AndFillArgs<U, T> = U | T extends null
  ? null
  : U extends null
  ? T
  : T extends null
  ? U
  : U & T;

type RouteParamFillArgsOf<R extends RouteParts> = R['prev'] extends null
  ? null
  : R['prev'] extends RouteParts
  ? AndFillArgs<
      RouteParamFillArgsOfRoutePartNode<R>,
      RouteParamFillArgsOf<R['prev']>
    >
  : null;

type UnionableStructProps = [t.Props, t.Props, ...Array<t.Props>];

type PropsOf<
  T extends UnionableStructProps,
  i extends keyof T & `${number}`,
> = T[i] extends t.Props ? T[i] : never;

type UnionableStructCodecsOf<T extends UnionableStructProps> = {
  [i in keyof T]: i extends `${number}`
    ? PropsOf<T, i> extends never
      ? never
      : t.TypeC<PropsOf<T, i>>
    : never;
};

type UnionOfProps<T extends UnionableStructProps> = t.UnionC<
  UnionableStructCodecsOf<T>
>['_A'];

// TODO: write tests

const templateRecursive = <R extends RouteParts>(parts: R): TemplateOf<R> => {
  if (parts.value == 'head') {
    return '' as any;
  } else if (parts.prev.value === 'head') {
    if (parts.value.type == 'routeParam') {
      return `/:${parts.value.name}` as any;
    } else if (parts.value.type == 'segment') {
      return `/${parts.value.segment}` as any;
    } else {
      return '' as any;
    }
  } else {
    const previousTemplate = templateRecursive(parts.prev);
    if (parts.value.type == 'routeParam') {
      return `${previousTemplate}/:${parts.value.name}` as any;
    } else if (parts.value.type == 'segment') {
      return `${previousTemplate}/${parts.value.segment}` as any;
    } else {
      return '' as any;
    }
  }
};

const template = <R extends RouteParts>(parts: R): TemplateOf<R> => {
  if (parts.value == 'head') {
    return '/' as any;
  } else {
    return templateRecursive(parts);
  }
};

const fillRouteParams = <R extends RouteParts>(
  routeArgs: RouteParamFillArgsOf<R>,
  parts: R,
): string => {
  if (parts.value === 'head') {
    return '/';
  }
  const pathHelper = <T extends RouteParts>(currentPart: T): string => {
    if (currentPart.value === 'head') {
      return '';
    }
    const filledPart =
      currentPart.value.type === 'segment'
        ? `/${currentPart.value.segment}`
        : currentPart.value.type === 'routeParam'
        ? `/${currentPart.value.codec.encode(
            (<any>routeArgs)[currentPart.value.name] as any,
          )}`
        : '';
    if (currentPart.prev) {
      return `${pathHelper(currentPart.prev)}${filledPart}`;
    } else {
      return filledPart;
    }
  };
  return pathHelper(parts);
};

export class BuiltQueryParamRoute<
  R extends RouteParts,
  Q extends QueryParams, // TODO: fix query params type
> {
  public __ROUTE_PARTS!: R;
  public __FILL_ARGS!: [RouteParamFillArgsOf<R>, Q];
  public __URL_ROUTE!: IBuiltURLRoute<
    this['__ROUTE_PARTS'],
    this['__FILL_ARGS']
  >;

  constructor(
    private readonly builtRoute: BuiltRoute<R>,
    private readonly queryCodec: t.Type<Q>,
  ) {}

  public get template(): TemplateOf<R> {
    return this.builtRoute.template;
  }

  private fillQueryParams(queryArgs: Q): string {
    const filled = this.queryCodec.encode(queryArgs);
    const goodKeys = Object.keys(filled).filter(
      (key) => typeof filled[key] !== 'undefined',
    );
    const keyValuePairs: Array<{
      key: string;
      value: string;
    }> = goodKeys.map((key) => {
      if (filled[key] === null) {
        return { key, value: 'null' };
      } else {
        return { key, value: filled[key] };
      }
    });
    const finalObject: Record<string, string> = {};
    keyValuePairs.forEach(({ key, value }) => {
      finalObject[key] = value;
    });
    const queryString = qs.stringify(finalObject);
    return queryString;
  }

  public fillPath(routeArgs: RouteParamFillArgsOf<R>, queryArgs: Q): string {
    const filledRoute = this.builtRoute.fillPath(routeArgs);
    const filledQueryParams = this.fillQueryParams(queryArgs);
    return filledQueryParams.length >= 1
      ? `${filledRoute}?${filledQueryParams}`
      : filledRoute;
  }

  public base(baseURL: string): this['__URL_ROUTE'] {
    // TODO: add url validation
    return {
      baseURL,
      fillURL: (routeArgs: RouteParamFillArgsOf<R>, queryArgs: Q) => {
        return `${baseURL}${this.fillPath(routeArgs, queryArgs)}`;
      },
      fillPath: this.fillPath,
      template: this.template,
    };
  }
}

export class BuiltRoute<R extends RouteParts> {
  public __ROUTE_PARTS!: R;
  public __FILL_ARGS!: [RouteParamFillArgsOf<R>];
  public __URL_ROUTE!: IBuiltURLRoute<
    this['__ROUTE_PARTS'],
    this['__FILL_ARGS']
  >;

  constructor(private readonly parts: R) {}

  public get template(): TemplateOf<R> {
    return template(this.parts);
  }

  // TODO: find a way to add optional querParams
  public queryParams<P extends QueryParamsUnitProps>(
    codecProps: P,
  ): BuiltQueryParamRoute<R, t.TypeOf<t.TypeC<P>>> {
    const codec = t.type(codecProps);
    return new BuiltQueryParamRoute(this, codec);
  }

  public queryParamsU<
    F extends QueryParamsUnitProps,
    G extends QueryParamsUnitProps,
    A extends Array<QueryParamsUnitProps>,
  >(
    first: F,
    second: G,
    ...rest: A
  ): BuiltQueryParamRoute<R, UnionOfProps<[F, G, ...A]>> {
    const union = t.union([
      t.type(first),
      t.type(second),
      ...rest.map((prop) => t.type(prop)),
    ]);

    return new BuiltQueryParamRoute(this, union as any);
  }

  public fillPath(routeArgs: RouteParamFillArgsOf<R>): string {
    return fillRouteParams(routeArgs, this.parts);
  }

  public base(baseURL: string): this['__URL_ROUTE'] {
    // TODO: add url validation
    return {
      baseURL,
      fillURL: (routeArgs: RouteParamFillArgsOf<R>) => {
        // TODO: centralize this into a single url + path joiner
        return `${baseURL}${this.fillPath(routeArgs)}`;
      },
      fillPath: this.fillPath.bind(this),
      template: this.template,
    };
  }
}

interface IBuiltURLRoute<R extends RouteParts, F extends Array<any>> {
  baseURL: string;
  fillURL(...args: F): string;
  fillPath(...args: F): string;
  template: TemplateOf<R>;
}

class RouteBuilder<R extends RouteParts> {
  private constructor(private readonly parts: R) {}

  public static init() {
    return new RouteBuilder({
      value: 'head',
      prev: null,
    });
  }

  public get template(): TemplateOf<R> {
    return template(this.parts);
  }

  public segment<S extends string>(
    segment: S,
  ): RouteBuilder<Append<SegmentPart<S>, R>> {
    return new RouteBuilder({
      prev: this.parts,
      value: {
        type: 'segment',
        segment,
      },
    });
  }

  public param<N extends string, A = string>(
    name: N extends keyof RouteParamFillArgsOf<R> ? never : N,
    codec?: t.Type<A, string>,
  ): RouteBuilder<Append<RouteParamPart<N, A>, R>> {
    const newParts: Append<RouteParamPart<N, A>, R> = {
      prev: this.parts,
      value: {
        type: 'routeParam',
        codec: codec || (t.string as any), // TODO: is this correct?
        name,
      },
    };
    return new RouteBuilder(newParts);
  }

  // TODO: find a way to avoid using the "BUILD" method and have the builder always act as a BuiltRoute
  public build(): BuiltRoute<R> {
    return new BuiltRoute(this.parts);
  }
}

// TODO: add url encoding (optional)

type BaseRouteBuilder = RouteBuilder<{ value: 'head'; prev: null }>;
export const route = (): BaseRouteBuilder => RouteBuilder.init();
