import {
  NextResponse
} from "next/server";

export const RedirectHandler = (next) => {
  return async (request, _next) => {
    const pathname = request.nextUrl.pathname;

    if (!pathname.includes("/api/")
      && !pathname.includes("/_next/static/")
      && !pathname.toLocaleLowerCase().endsWith(".svg")
      && !pathname.toLocaleLowerCase().endsWith(".png")
      && !pathname.toLocaleLowerCase().endsWith(".ico")
      && !pathname.toLocaleLowerCase().endsWith(".jpeg")
      && !pathname.toLocaleLowerCase().endsWith(".webp")
      && !pathname.toLocaleLowerCase().endsWith(".avif")
      && !pathname.toLocaleLowerCase().endsWith(".jpg")
      && !pathname.toLocaleLowerCase().endsWith(".json")
      && !pathname.includes("/admin/")) {

      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/redirects?active=true&size=10000&page=1`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store'
        }
      });
      const { redirects } = await apiResponse.json();
      if (redirects && redirects.length) {
        let matchedRule = null;
        let regexMatch = null;

        for (const rule of redirects) {
          if (rule.redirectType === "EXACT" && rule.source === pathname) {
            matchedRule = rule;
            break;
          }
          if (rule.redirectType === "REGEX" && rule.source) {
            try {
              const pattern = new RegExp(rule.source);
              const m = pathname.match(pattern);
              if (m) {
                matchedRule = rule;
                regexMatch = { pattern, match: m };
                break;
              }
            } catch (_e) {
              // invalid regex, skip
            }
          }
        }

        if (matchedRule) {
          const statusCode = matchedRule.permanent ? 301 : 302;

          let targetPath = matchedRule.destination || "/";

          // Support capture group substitution when destination uses $1, $2, ...
          if (regexMatch && /\$\d+/.test(targetPath)) {
            try {
              targetPath = pathname.replace(regexMatch.pattern, targetPath);
            } catch (_e) {
              // fallback to static destination
            }
          }

          // Support absolute destinations as well as relative paths
          let redirectUrl;
          try {
            if (targetPath.startsWith("http://") || targetPath.startsWith("https://")) {
              redirectUrl = new URL(targetPath);
            } else {
              redirectUrl = new URL(targetPath, request.url);
            }
          } catch (_e) {
            const url = request.nextUrl.clone();
            url.pathname = targetPath;
            redirectUrl = url;
          }

          return NextResponse.redirect(redirectUrl, statusCode);
        }
      }
    }


    return next(request, _next);
  };
};