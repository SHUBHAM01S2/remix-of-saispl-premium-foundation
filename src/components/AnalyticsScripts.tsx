/**
 * Analytics & tracking pixel loader.
 *
 * Every integration is opt-in via a `VITE_*` env var. When a value is not
 * set, its <script>/<img> block is not rendered — so the site ships clean
 * until the user drops in real IDs.
 *
 * Configure in the project's env:
 *   VITE_GA_MEASUREMENT_ID   e.g. "G-XXXXXXXXXX"
 *   VITE_META_PIXEL_ID       Meta / Facebook Pixel numeric ID
 *   VITE_LINKEDIN_PARTNER_ID LinkedIn Insight Tag partner ID
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const LINKEDIN_ID = import.meta.env.VITE_LINKEDIN_PARTNER_ID as string | undefined;

export function AnalyticsScripts() {
  return (
    <>
      {/* Google Analytics 4 */}
      {GA_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`,
            }}
          />
        </>
      )}

      {/* Meta / Facebook Pixel */}
      {META_PIXEL_ID && (
        <>
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
            }}
          />
        </>
      )}

      {/* LinkedIn Insight Tag */}
      {LINKEDIN_ID && (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `_linkedin_partner_id="${LINKEDIN_ID}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`,
          }}
        />
      )}
    </>
  );
}
