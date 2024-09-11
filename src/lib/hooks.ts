import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const DEFAULT_DEBOUNCE = 500;

export function useMutableSearchParams(options?: { debounce?: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const deboucedHistoryReplace = useDebouncedCallback((newPathname: string) => {
    history.replaceState(null, "", newPathname);
  }, options?.debounce ?? DEFAULT_DEBOUNCE);

  const mutate = useCallback(
    (fn: (sp: URLSearchParams) => void) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      fn(newSearchParams);

      const searchStr = newSearchParams.toString();
      const newPathname = `${pathname}${searchStr ? `?${searchStr}` : ""}`;

      return {
        push: (options: NavigateOptions) => {
          router.push(newPathname, options);
        },
        replace: (options: NavigateOptions) => {
          router.replace(newPathname, options);
        },
        shallowReplace: () => {
          deboucedHistoryReplace(newPathname);

          // return {
          //   cancel: deboucedHistoryReplace.cancel
          // }
        },
      };
    },
    [searchParams, router, pathname, deboucedHistoryReplace],
  );

  useEffect(() => {
    return () => deboucedHistoryReplace.cancel();
  }, [deboucedHistoryReplace]);

  return {
    ...searchParams,
    mutate,
    cancelUpdate: deboucedHistoryReplace.cancel,
  };
}

type OmitErrorResponse<T> = T extends { errors: any } ? never : T;

export function useFetch<T>(
  input: string,
  init?: Pick<RequestInit, "method"> | undefined,
  options?: { disabled?: boolean },
) {
  const [signal, setSignal] = useState(0);
  const [data, setData] = useState<OmitErrorResponse<T> | null>(null);
  const [pending, setPending] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(-1);

  const initSerialized = init ? JSON.stringify(init) : undefined;

  const isDisabled = options?.disabled ?? false;

  useEffect(() => {
    if (isDisabled) return;

    let locked = false;

    const abortController = new AbortController();
    setPending(true);

    const init = initSerialized ? JSON.parse(initSerialized) : undefined;
    fetch(input, {
      signal: abortController.signal,
      ...init,
    })
      .then((res) => res.json())
      .then((data: T) => {
        if (locked) return;

        if (typeof data === "object" && data !== null && "errors" in data) {
          // TODO: handle error
        } else {
          setData(data as OmitErrorResponse<T>);
          setFetchedAt(Date.now());
        }
        setPending(false);
      })
      .catch(() => {
        if (locked) return;
        setData(null);
        setPending(false);
      });

    return () => {
      locked = true;
      abortController.abort("component unmounted, or changed request");
    };
  }, [input, initSerialized, isDisabled, signal]);

  const reset = useCallback(() => {
    setData(null);
    setPending(false);
    setFetchedAt(-1);
  }, []);

  const refresh = useCallback(() => {
    setSignal((prev) => prev + 1);
  }, []);

  return {
    data,
    pending,
    reset,
    fetchedAt,
    refresh,
  };
}
