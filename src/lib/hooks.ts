import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
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
    [searchParams, router, pathname],
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
