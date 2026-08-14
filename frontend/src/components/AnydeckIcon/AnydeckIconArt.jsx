// Generated from the Claude Design source `Anydeck Icon Animated.dc.html`.
// 13 real camera projections of one keycap, plus the resting pose the press
// animation uses. Every colour is a CSS class so the palette lives in
// `anydeck-icon.css` — see the token list there before editing anything here.
/* eslint-disable */

export function AnydeckIconArt({ uid }) {
  return (
    <svg
      className="adk-canvas"
      viewBox="0 0 1024 1024"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
    <defs>
      <linearGradient id={`${uid}anBg`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" className="adk-s-tile-1" />
        <stop offset="0.55" className="adk-s-tile-2" />
        <stop offset="1" className="adk-s-tile-3" />
      </linearGradient>
      <radialGradient id={`${uid}anGlow`} cx="0.5" cy="0.42" r="0.55">
        <stop offset="0" className="adk-s-glow-in" />
        <stop offset="1" className="adk-s-glow-out" />
      </radialGradient>
      <linearGradient id={`${uid}capTop`} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" className="adk-s-accent-light" />
        <stop offset="1" className="adk-s-accent" />
      </linearGradient>
      <linearGradient id={`${uid}capSide`} x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" className="adk-s-accent-side" />
        <stop offset="1" className="adk-s-accent-dark" />
      </linearGradient>
      <linearGradient id={`${uid}dish`} x1="0.12" y1="0" x2="0.88" y2="1">
        <stop offset="0" className="adk-s-dish-1" />
        <stop offset="0.5" className="adk-s-dish-2" />
        <stop offset="1" className="adk-s-dish-3" />
      </linearGradient>
      <linearGradient id={`${uid}baseTop`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" className="adk-s-base-1" />
        <stop offset="1" className="adk-s-base-2" />
      </linearGradient>
      <linearGradient id={`${uid}upperTop`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" className="adk-s-upper-1" />
        <stop offset="1" className="adk-s-upper-2" />
      </linearGradient>
      <linearGradient id={`${uid}gCapTop`} gradientUnits="userSpaceOnUse" x1="240" y1="120" x2="790" y2="640">
        <stop offset="0" className="adk-s-accent-light" />
        <stop offset="1" className="adk-s-accent" />
      </linearGradient>
      <linearGradient id={`${uid}gCapSide`} gradientUnits="userSpaceOnUse" x1="240" y1="200" x2="450" y2="700">
        <stop offset="0" className="adk-s-accent-side" />
        <stop offset="1" className="adk-s-accent-dark" />
      </linearGradient>
      <linearGradient id={`${uid}gDish`} gradientUnits="userSpaceOnUse" x1="300" y1="140" x2="740" y2="620">
        <stop offset="0" className="adk-s-dish-1" />
        <stop offset="0.5" className="adk-s-dish-2" />
        <stop offset="1" className="adk-s-dish-3" />
      </linearGradient>
      <linearGradient id={`${uid}gBase`} gradientUnits="userSpaceOnUse" x1="200" y1="480" x2="820" y2="930">
        <stop offset="0" className="adk-s-base-1" />
        <stop offset="1" className="adk-s-base-2" />
      </linearGradient>
      <linearGradient id={`${uid}gUpper`} gradientUnits="userSpaceOnUse" x1="300" y1="470" x2="710" y2="790">
        <stop offset="0" className="adk-s-upper-1" />
        <stop offset="1" className="adk-s-upper-2" />
      </linearGradient>
      <filter id={`${uid}anSoft`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="26" />
      </filter>
      <filter id={`${uid}anSoft2`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <clipPath id={`${uid}anFrame`}>
        <rect x="0" y="0" width="1024" height="1024" rx="232" ry="232" />
      </clipPath>
    </defs>
    <g clipPath={`url(#${uid}anFrame)`}>
      <rect x="0" y="0" width="1024" height="1024" fill={`url(#${uid}anBg)`} />
      <rect x="0" y="0" width="1024" height="1024" fill={`url(#${uid}anGlow)`} />
      <g data-rest="1">
        <g transform="translate(512 512) scale(1.1) translate(-508 -527.5)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.5" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M807.6 665.7L508.0 838.6L208.4 665.7L508.0 492.7Z" fill={`url(#${uid}baseTop)`} />
          <path d="M807.6 665.7L508.0 838.6L508.0 922.0L807.6 749.0Z" className="adk-hull-r" />
          <path d="M508.0 838.6L208.4 665.7L208.4 749.0L508.0 922.0Z" className="adk-hull-l" />
          <g data-contact="1">
            <path d="M783.5 556.0L790.9 561.4L796.0 567.5L798.7 574.2L798.7 581.0L796.0 587.7L790.9 593.9L783.5 599.2L580.2 716.6L570.9 720.9L560.3 723.9L548.7 725.4L536.8 725.4L525.3 723.9L514.6 720.9L505.3 716.6L302.0 599.2L294.6 593.9L289.5 587.7L286.9 581.0L286.9 574.2L289.5 567.5L294.6 561.4L302.0 556.0L505.3 438.6L514.6 434.4L525.3 431.4L536.8 429.9L548.7 429.9L560.3 431.4L570.9 434.4L580.2 438.6Z" opacity="0.5" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          </g>
          <path d="M705.9 597.7L508.0 712.0L310.1 597.7L508.0 483.4Z" fill={`url(#${uid}upperTop)`} />
          <path d="M705.9 597.7L508.0 712.0L508.0 779.9L705.9 665.7Z" className="adk-neck-r" />
          <path d="M508.0 712.0L310.1 597.7L310.1 665.7L508.0 779.9Z" className="adk-neck-l" />
          <path d="M537.4 517.4L568.2 499.6L568.2 579.9L537.4 597.7Z" className="adk-stem-1" />
          <path d="M447.8 499.6L478.6 517.4L478.6 597.7L447.8 579.9Z" className="adk-stem-2" />
          <path d="M477.2 552.1L508.0 534.4L508.0 614.7L477.2 632.4Z" className="adk-stem-1" />
          <path d="M508.0 534.4L538.8 552.1L538.8 632.4L508.0 614.7Z" className="adk-stem-2" />
          <path d="M447.8 535.2L477.2 552.1L477.2 632.4L447.8 615.5Z" className="adk-stem-2" />
          <path d="M538.8 552.1L568.2 535.2L568.2 615.5L538.8 632.4Z" className="adk-stem-1" />
          <path d="M568.2 535.2L537.4 517.4L568.2 499.6L538.8 482.7L508.0 500.4L477.2 482.7L447.8 499.6L478.6 517.4L447.8 535.2L477.2 552.1L508.0 534.4L538.8 552.1Z" className="adk-stem-top" />
          <g data-cap="1">
            <path d="M286.9 358.0L319.5 269.2L321.6 263.9L325.7 259.1L331.5 254.9L513.3 149.9L520.6 146.5L529.0 144.2L538.1 143.0L547.4 143.0L556.5 144.2L564.9 146.5L572.2 149.9L754.1 254.9L759.9 259.1L763.9 263.9L766.0 269.2L798.7 358.0L798.7 364.8L796.0 371.5L790.9 377.7L783.5 383.0L580.2 500.4L570.9 504.7L560.3 507.7L548.7 509.2L536.8 509.2L525.3 507.7L514.6 504.7L505.3 500.4L302.0 383.0L294.6 377.7L289.5 371.5L286.9 364.8Z" fill={`url(#${uid}capSide)`} />
            <path d="M754.1 254.9L759.9 259.1L763.9 263.9L766.0 269.2L766.0 274.5L763.9 279.8L759.9 284.6L754.1 288.8L572.2 393.9L564.9 397.2L556.5 399.5L547.4 400.7L538.1 400.7L529.0 399.5L520.6 397.2L513.3 393.9L331.5 288.8L325.7 284.6L321.6 279.8L319.5 274.5L319.5 269.2L321.6 263.9L325.7 259.1L331.5 254.9L513.3 149.9L520.6 146.5L529.0 144.2L538.1 143.0L547.4 143.0L556.5 144.2L564.9 146.5L572.2 149.9Z" fill={`url(#${uid}capTop)`} />
            <path d="M754.1 254.9L759.9 259.1L763.9 263.9L766.0 269.2L766.0 274.5L763.9 279.8L759.9 284.6L754.1 288.8L572.2 393.9L564.9 397.2L556.5 399.5L547.4 400.7L538.1 400.7L529.0 399.5L520.6 397.2L513.3 393.9L331.5 288.8L325.7 284.6L321.6 279.8L319.5 274.5L319.5 269.2L321.6 263.9L325.7 259.1L331.5 254.9L513.3 149.9L520.6 146.5L529.0 144.2L538.1 143.0L547.4 143.0L556.5 144.2L564.9 146.5L572.2 149.9Z" fill="none" strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M714.0 256.4L719.2 260.2L722.9 264.6L724.8 269.4L724.8 274.3L722.9 279.1L719.2 283.5L714.0 287.3L569.5 370.7L562.9 373.7L555.3 375.9L547.0 376.9L538.5 376.9L530.3 375.9L522.6 373.7L516.0 370.7L371.6 287.3L366.3 283.5L362.6 279.1L360.7 274.3L360.7 269.4L362.6 264.6L366.3 260.2L371.6 256.4L516.0 173.0L522.6 170.0L530.3 167.8L538.5 166.8L547.0 166.8L555.3 167.8L562.9 170.0L569.5 173.0Z" fill={`url(#${uid}dish)`} />
            <path d="M714.0 256.4L719.2 260.2L722.9 264.6L724.8 269.4L724.8 274.3L722.9 279.1L719.2 283.5L714.0 287.3L569.5 370.7L562.9 373.7L555.3 375.9L547.0 376.9L538.5 376.9L530.3 375.9L522.6 373.7L516.0 370.7L371.6 287.3L366.3 283.5L362.6 279.1L360.7 274.3L360.7 269.4L362.6 264.6L366.3 260.2L371.6 256.4L516.0 173.0L522.6 170.0L530.3 167.8L538.5 166.8L547.0 166.8L555.3 167.8L562.9 170.0L569.5 173.0Z" fill="none" strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <g transform="matrix(1.3374 0.7722 -1.3374 0.7722 542.8 271.9)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
      </g>
      <g data-frames="1">
        <g data-frame="0" opacity="0" transform="translate(512 512) scale(1.1) translate(-508 -527.5)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.500" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M748.7 576.1L758.4 583.9L763.5 593L763.5 602.5L758.4 611.6L748.7 619.4L545.4 736.7L532 742.3L516.3 745.3L499.7 745.3L484 742.3L470.6 736.7L267.3 619.4L257.6 611.6L252.5 602.5L252.5 593L257.6 583.9L267.3 576.1L470.6 458.8L484 453.2L499.7 450.2L516.3 450.2L532 453.2L545.4 458.8Z" opacity="0.500" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M807.5 665.7L508 838.6L208.5 665.7L508 492.7Z" fill={`url(#${uid}gBase)`} />
          <path d="M568.2 580L538.8 563L538.8 482.7L568.2 499.7Z" className="adk-stem-4" />
          <path d="M477.2 563L447.8 580L447.8 499.7L477.2 482.7Z" className="adk-stem-3" />
          <path d="M538.8 563L508 580.8L508 500.5L538.8 482.7Z" className="adk-stem-4" />
          <path d="M508 580.8L477.2 563L477.2 482.7L508 500.5Z" className="adk-stem-3" />
          <path d="M705.9 597.7L508 712L310.1 597.7L508 483.5Z" fill={`url(#${uid}gUpper)`} />
          <path d="M568.2 615.5L537.4 597.7L537.4 517.5L568.2 535.2Z" className="adk-stem-1" />
          <path d="M478.6 597.7L447.8 615.5L447.8 535.2L478.6 517.5Z" className="adk-stem-2" />
          <path d="M807.5 749L508 922L508 838.6L807.5 665.7Z" className="adk-hull-r" />
          <path d="M508 922L208.5 749L208.5 665.7L508 838.6Z" className="adk-hull-l" />
          <path d="M705.9 665.7L508 779.9L508 712L705.9 597.7Z" className="adk-neck-r" />
          <path d="M508 779.9L310.1 665.7L310.1 597.7L508 712Z" className="adk-neck-l" />
          <path d="M568.2 535.2L537.4 517.5L568.2 499.7L538.8 482.7L508 500.5L477.2 482.7L447.8 499.7L478.6 517.5L447.8 535.2L477.2 552.2L508 534.4L538.8 552.2Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M763.5 521.9L763.5 531.5L730.9 440.9L730.9 433.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M252.5 531.5L252.5 521.9L285.1 433.4L285.1 440.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M763.5 531.5L758.4 540.6L726.9 448.1L730.9 440.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M257.6 540.6L252.5 531.5L285.1 440.9L289.1 448.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M758.4 540.6L748.7 548.3L719.3 454.2L726.9 448.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M267.3 548.3L257.6 540.6L289.1 448.1L296.7 454.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M719.3 420.2L726.9 426.3L730.9 433.4L730.9 440.9L726.9 448.1L719.3 454.2L537.4 559.1L526.9 563.6L514.5 565.9L501.5 565.9L489.1 563.6L478.6 559.1L296.7 454.2L289.1 448.1L285.1 440.9L285.1 433.4L289.1 426.3L296.7 420.2L478.6 315.2L489.1 310.8L501.5 308.5L514.5 308.5L526.9 310.8L537.4 315.2Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M679.1 421.7L686.1 427.3L689.8 433.8L689.8 440.6L686.1 447.1L679.1 452.6L534.7 536L525.2 540L513.9 542.1L502.1 542.1L490.8 540L481.3 536L336.9 452.6L329.9 447.1L326.2 440.6L326.2 433.8L329.9 427.3L336.9 421.7L481.3 338.4L490.8 334.3L502.1 332.2L513.9 332.2L525.2 334.3L534.7 338.4Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <path d="M748.7 548.3L545.4 665.7L537.4 559.1L719.3 454.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M470.6 665.7L267.3 548.3L296.7 454.2L478.6 559.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M545.4 665.7L532 671.3L526.9 563.6L537.4 559.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M484 671.3L470.6 665.7L478.6 559.1L489.1 563.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M532 671.3L516.3 674.2L514.5 565.9L526.9 563.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M499.7 674.2L484 671.3L489.1 563.6L501.5 565.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M516.3 674.2L499.7 674.2L501.5 565.9L514.5 565.9Z" fill={`url(#${uid}gCapSide)`} />
            <g transform="matrix(1.3371 0.772 -1.3371 0.772 508 437.1687)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="1" opacity="0" transform="translate(512 512) scale(1.1056) translate(-508 -526.3)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.489" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M748.2 575.5L758.1 583.3L763.4 592.5L763.6 602.3L758.7 611.6L749.1 619.5L548.1 740.3L534.8 746.1L519.1 749.2L502.5 749.4L486.7 746.4L473.2 740.8L267.8 622.6L257.9 614.8L252.6 605.5L252.4 595.8L257.3 586.5L266.9 578.5L467.9 457.7L481.2 451.9L496.9 448.8L513.5 448.7L529.3 451.6L542.8 457.2Z" opacity="0.489" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M807.5 664.4L511.3 842.4L208.5 668.2L504.7 490.2Z" fill={`url(#${uid}gBase)`} />
          <path d="M567.8 580.6L538.1 563.4L538.1 483.9L567.8 501Z" className="adk-stem-4" />
          <path d="M476.6 563.8L447.5 581.3L447.5 501.8L476.6 484.3Z" className="adk-stem-3" />
          <path d="M538.1 563.4L507.7 581.7L507.7 502.2L538.1 483.9Z" className="adk-stem-4" />
          <path d="M507.7 581.7L476.6 563.8L476.6 484.3L507.7 502.2Z" className="adk-stem-3" />
          <path d="M705.9 597.8L510.2 715.4L310.1 600.3L505.8 482.6Z" fill={`url(#${uid}gUpper)`} />
          <path d="M807.5 747L511.3 925L511.3 842.4L807.5 664.4Z" className="adk-hull-r" />
          <path d="M568.5 616.7L537.4 598.8L537.4 519.3L568.5 537.2Z" className="adk-stem-1" />
          <path d="M478.6 599.2L448.2 617.5L448.2 538L478.6 519.7Z" className="adk-stem-2" />
          <path d="M511.3 925L208.5 750.8L208.5 668.2L511.3 842.4Z" className="adk-hull-l" />
          <path d="M705.9 665L510.2 782.7L510.2 715.4L705.9 597.8Z" className="adk-neck-r" />
          <path d="M510.2 782.7L310.1 667.6L310.1 600.3L510.2 715.4Z" className="adk-neck-l" />
          <path d="M568.5 537.2L537.4 519.3L567.8 501L538.1 483.9L507.7 502.2L476.6 484.3L447.5 501.8L478.6 519.7L448.2 538L477.9 555.1L508.3 536.8L539.4 554.7Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M763.4 522.2L763.6 531.9L731 442.4L730.8 434.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M252.6 535.2L252.4 525.4L285 437.6L285.2 445.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M763.6 531.9L758.7 541.2L727.1 449.7L731 442.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M257.9 544.4L252.6 535.2L285.2 445.2L289.3 452.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M758.7 541.2L749.1 549.1L719.6 455.9L727.1 449.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M267.8 552.2L257.9 544.4L289.3 452.5L297.1 458.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M718.9 421.3L726.7 427.5L730.8 434.7L731 442.4L727.1 449.7L719.6 455.9L539.7 564L529.3 568.6L516.9 571L503.9 571.1L491.5 568.8L480.9 564.4L297.1 458.6L289.3 452.5L285.2 445.2L285 437.6L288.9 430.3L296.4 424L476.3 315.9L486.7 311.4L499.1 308.9L512.1 308.8L524.5 311.1L535.1 315.5Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M678.8 423.2L685.9 428.7L689.7 435.3L689.8 442.3L686.3 448.9L679.4 454.6L536.6 540.5L527.1 544.6L515.9 546.8L504.1 546.9L492.8 544.8L483.1 540.8L337.2 456.8L330.1 451.2L326.3 444.6L326.2 437.7L329.7 431L336.6 425.3L479.4 339.5L488.9 335.3L500.1 333.1L511.9 333L523.2 335.1L532.9 339.2Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <path d="M749.1 549.1L548.1 670L539.7 564L719.6 455.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M473.2 670.5L267.8 552.2L297.1 458.6L480.9 564.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M548.1 670L534.8 675.8L529.3 568.6L539.7 564Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M486.7 676.1L473.2 670.5L480.9 564.4L491.5 568.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M534.8 675.8L519.1 678.9L516.9 571L529.3 568.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M502.5 679L486.7 676.1L491.5 568.8L503.9 571.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M519.1 678.9L502.5 679L503.9 571.1L516.9 571Z" fill={`url(#${uid}gCapSide)`} />
            <g transform="matrix(1.3516 0.7777 -1.3224 0.7949 508 439.9758)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="2" opacity="0" transform="translate(512 512) scale(1.1223) translate(-508 -523.1)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.456" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M746.8 573.3L757.1 581.4L762.9 591L763.6 601.2L759.2 611.1L750.1 619.7L555.9 751.1L542.9 757.4L527.4 761L510.9 761.5L494.9 758.7L481.1 753.1L269.2 632.7L258.9 624.7L253.1 615.1L252.4 604.8L256.8 594.9L265.9 586.3L460.1 455L473.1 448.6L488.6 445L505.1 444.6L521.1 447.3L534.9 453Z" opacity="0.456" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M807.2 660.2L521.1 853.8L208.8 676.4L494.9 482.8Z" fill={`url(#${uid}gBase)`} />
          <path d="M566.8 582.4L536.1 564.9L536.1 487.8L566.8 505.2Z" className="adk-stem-4" />
          <path d="M536.1 564.9L506.7 584.8L506.7 507.6L536.1 487.8Z" className="adk-stem-4" />
          <path d="M506.7 584.8L474.7 566.6L474.7 489.4L506.7 507.6Z" className="adk-stem-3" />
          <path d="M474.7 566.6L446.5 585.6L446.5 508.4L474.7 489.4Z" className="adk-stem-3" />
          <path d="M705.7 597.7L516.6 725.6L310.3 608.4L499.4 480.5Z" fill={`url(#${uid}gUpper)`} />
          <path d="M807.2 740.3L521.1 933.9L521.1 853.8L807.2 660.2Z" className="adk-hull-r" />
          <path d="M521.1 933.9L208.8 756.5L208.8 676.4L521.1 853.8Z" className="adk-hull-l" />
          <path d="M569.5 620.4L537.4 602.2L537.4 525.1L569.5 543.3Z" className="adk-stem-1" />
          <path d="M478.6 603.8L449.2 623.7L449.2 546.5L478.6 526.7Z" className="adk-stem-2" />
          <path d="M705.7 663L516.6 790.9L516.6 725.6L705.7 597.7Z" className="adk-neck-r" />
          <path d="M516.6 790.9L310.3 673.7L310.3 608.4L516.6 725.6Z" className="adk-neck-l" />
          <path d="M569.5 543.3L537.4 525.1L566.8 505.2L536.1 487.8L506.7 507.6L474.7 489.4L446.5 508.4L478.6 526.7L449.2 546.5L479.9 564L509.3 544.1L541.3 562.3Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M762.9 522.7L763.6 533L731 446.7L730.4 438.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M763.6 533L759.2 542.9L727.5 454.5L731 446.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M253.1 546.8L252.4 536.5L285 450.7L285.6 458.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M759.2 542.9L750.1 551.4L720.3 461.2L727.5 454.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M258.9 556.4L253.1 546.8L285.6 458.8L290.1 466.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M269.2 564.5L258.9 556.4L290.1 466.3L298.2 472.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M717.8 424.8L725.9 431.1L730.4 438.6L731 446.7L727.5 454.5L720.3 461.2L546.6 578.7L536.4 583.8L524.2 586.6L511.2 586.9L498.7 584.8L487.8 580.3L298.2 472.6L290.1 466.3L285.6 458.8L285 450.7L288.5 442.9L295.7 436.2L469.4 318.7L479.6 313.7L491.8 310.8L504.8 310.5L517.3 312.6L528.2 317.1Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M677.8 427.5L685.2 433.3L689.3 440.1L689.8 447.5L686.7 454.5L680.1 460.6L542.2 554L532.9 558.5L521.8 561.1L510 561.4L498.6 559.5L488.7 555.4L338.2 469.9L330.8 464.2L326.7 457.3L326.2 450L329.3 442.9L335.9 436.8L473.8 343.4L483.1 338.9L494.2 336.3L506 336L517.4 338L527.3 342Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <path d="M750.1 551.4L555.9 682.8L546.6 578.7L720.3 461.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M481.1 684.8L269.2 564.5L298.2 472.6L487.8 580.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M555.9 682.8L542.9 689.2L536.4 583.8L546.6 578.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M494.9 690.5L481.1 684.8L487.8 580.3L498.7 584.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M542.9 689.2L527.4 692.8L524.2 586.6L536.4 583.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M510.9 693.2L494.9 690.5L498.7 584.8L511.2 586.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M527.4 692.8L510.9 693.2L511.2 586.9L524.2 586.6Z" fill={`url(#${uid}gCapSide)`} />
            <g transform="matrix(1.3941 0.7918 -1.2775 0.8641 508 448.7054)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="3" opacity="0" transform="translate(512 512) scale(1.15) translate(-508 -519.6)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.400" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M743.8 569.3L754.8 577.7L761.5 587.8L763.1 598.9L759.6 609.7L751.2 619.3L568.8 768.3L556.5 775.7L541.3 780.1L524.8 781.2L508.6 778.8L494.3 773.2L272.2 650.9L261.2 642.6L254.5 632.5L252.9 621.4L256.4 610.6L264.8 601L447.2 452L459.5 444.6L474.7 440.2L491.2 439.1L507.4 441.5L521.7 447.1Z" opacity="0.400" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M806.1 652.2L537.4 871.7L209.9 691.6L478.6 472Z" fill={`url(#${uid}gBase)`} />
          <path d="M564.9 585.7L532.7 568L532.7 495L564.9 512.7Z" className="adk-stem-4" />
          <path d="M532.7 568L505.1 590.5L505.1 517.6L532.7 495Z" className="adk-stem-4" />
          <path d="M704.9 597.1L527.4 742.2L311.1 623.2L488.6 478.1Z" fill={`url(#${uid}gUpper)`} />
          <path d="M505.1 590.5L471.5 572L471.5 499.1L505.1 517.6Z" className="adk-stem-3" />
          <path d="M471.5 572L445.1 593.6L445.1 520.6L471.5 499.1Z" className="adk-stem-3" />
          <path d="M806.1 727.9L537.4 947.5L537.4 871.7L806.1 652.2Z" className="adk-hull-r" />
          <path d="M537.4 947.5L209.9 767.3L209.9 691.6L537.4 871.7Z" className="adk-hull-l" />
          <path d="M704.9 658.9L527.4 803.9L527.4 742.2L704.9 597.1Z" className="adk-neck-r" />
          <path d="M570.9 626.7L537.3 608.2L537.3 535.3L570.9 553.8Z" className="adk-stem-1" />
          <path d="M478.7 612.1L451.1 634.6L451.1 561.7L478.7 539.1Z" className="adk-stem-2" />
          <path d="M527.4 803.9L311.1 684.9L311.1 623.2L527.4 742.2Z" className="adk-neck-l" />
          <path d="M570.9 553.8L537.3 535.3L564.9 512.7L532.7 495L505.1 517.6L471.5 499.1L445.1 520.6L478.7 539.1L451.1 561.7L483.3 579.4L510.9 556.8L544.5 575.3Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M761.5 523.3L763.1 534.3L730.5 453.9L729.2 445.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M763.1 534.3L759.6 545.2L727.7 462.5L730.5 453.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M759.6 545.2L751.2 554.8L721.1 470L727.7 462.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M252.9 556.9L256.4 546L288.3 466L285.5 474.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M254.5 567.9L252.9 556.9L285.5 474.6L286.8 483.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M261.2 578.1L254.5 567.9L286.8 483.2L292 491.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M715.4 430.7L724 437.3L729.2 445.3L730.5 453.9L727.7 462.5L721.1 470L558 603.3L548.3 609.1L536.3 612.6L523.4 613.4L510.7 611.6L499.4 607.2L300.6 497.8L292 491.2L286.8 483.2L285.5 474.6L288.3 466L294.9 458.5L458 325.2L467.7 319.4L479.7 315.9L492.6 315.1L505.3 316.9L516.6 321.3Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M675.7 435.2L683.6 441.1L688.3 448.4L689.5 456.3L686.9 464L680.9 470.8L551.4 576.7L542.5 582L531.7 585.1L519.9 585.9L508.4 584.2L498.2 580.2L340.3 493.3L332.4 487.4L327.7 480.1L326.5 472.2L329.1 464.5L335.1 457.7L464.6 351.8L473.5 346.5L484.3 343.4L496.1 342.6L507.6 344.3L517.8 348.3Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <path d="M272.2 586.4L261.2 578.1L292 491.2L300.6 497.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M751.2 554.8L568.8 703.8L558 603.3L721.1 470Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M494.3 708.7L272.2 586.4L300.6 497.8L499.4 607.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M568.8 703.8L556.5 711.1L548.3 609.1L558 603.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M508.6 714.3L494.3 708.7L499.4 607.2L510.7 611.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M556.5 711.1L541.3 715.6L536.3 612.6L548.3 609.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M524.8 716.7L508.6 714.3L510.7 611.6L523.4 613.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M541.3 715.6L524.8 716.7L523.4 613.4L536.3 612.6Z" fill={`url(#${uid}gCapSide)`} />
            <g transform="matrix(1.4617 0.8043 -1.1996 0.9801 508 464.2506)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="4" opacity="0" transform="translate(512 512) scale(1.1889) translate(-508 -518.7)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.322" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M738.5 563.1L750.4 571.6L758.2 582.3L761.1 594.4L758.8 606.4L751.5 617.4L586.7 790.8L575.2 799.6L560.5 805.3L544.2 807.4L527.8 805.7L512.9 800.4L277.5 679L265.6 670.5L257.8 659.7L254.9 647.7L257.2 635.6L264.5 624.7L429.3 451.3L440.8 442.5L455.5 436.8L471.8 434.7L488.2 436.3L503.1 441.7Z" opacity="0.322" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M803 639L560 894.5L213 715.6L456 460.1Z" fill={`url(#${uid}gBase)`} />
          <path d="M803 708.1L560 963.6L560 894.5L803 639Z" className="adk-hull-r" />
          <path d="M702.9 595.7L542.4 764.5L313.1 646.3L473.6 477.5Z" fill={`url(#${uid}gUpper)`} />
          <path d="M561.9 591L527.8 573.5L527.8 506.9L561.9 524.5Z" className="adk-stem-4" />
          <path d="M527.8 573.5L502.9 599.7L502.9 533.2L527.8 506.9Z" className="adk-stem-4" />
          <path d="M502.9 599.7L467.3 581.3L467.3 514.8L502.9 533.2Z" className="adk-stem-3" />
          <path d="M467.3 581.3L443.4 606.4L443.4 539.9L467.3 514.8Z" className="adk-stem-3" />
          <path d="M560 963.6L213 784.7L213 715.6L560 894.5Z" className="adk-hull-l" />
          <path d="M702.9 652L542.4 820.8L542.4 764.5L702.9 595.7Z" className="adk-neck-r" />
          <path d="M572.6 635.6L537 617.3L537 550.7L572.6 569.1Z" className="adk-stem-1" />
          <path d="M542.4 820.8L313.1 702.6L313.1 646.3L542.4 764.5Z" className="adk-neck-l" />
          <path d="M479 624.8L454.1 651L454.1 584.5L479 558.3Z" className="adk-stem-2" />
          <path d="M572.6 569.1L537 550.7L561.9 524.5L527.8 506.9L502.9 533.2L467.3 514.8L443.4 539.9L479 558.3L454.1 584.5L488.2 602.1L513.1 575.8L548.7 594.2Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M758.2 523.5L761.1 535.5L728.7 464.2L726.4 454.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M761.1 535.5L758.8 547.6L726.9 473.7L728.7 464.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M758.8 547.6L751.5 558.6L721.2 482.3L726.9 473.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M254.9 588.9L257.2 576.8L289.1 502.3L287.3 511.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M257.8 600.9L254.9 588.9L287.3 511.8L289.6 521.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M265.6 611.6L257.8 600.9L289.6 521.2L295.7 529.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M710.9 439.6L720.3 446.3L726.4 454.8L728.7 464.2L726.9 473.7L721.2 482.3L573.7 637.4L564.6 644.3L553.1 648.8L540.3 650.5L527.4 649.2L515.7 645L305.1 536.3L295.7 529.7L289.6 521.2L287.3 511.8L289.1 502.3L294.8 493.7L442.3 338.5L451.4 331.6L462.9 327.1L475.7 325.5L488.6 326.8L500.3 331Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M671.9 446.7L680.4 452.8L686 460.5L688 469L686.4 477.7L681.2 485.5L564.1 608.7L555.8 615L545.4 619L533.7 620.6L522 619.3L511.4 615.5L344.1 529.3L335.6 523.2L330 515.5L328 506.9L329.6 498.3L334.8 490.5L451.9 367.3L460.2 361L470.6 356.9L482.3 355.4L494 356.6L504.6 360.4Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <path d="M277.5 620.1L265.6 611.6L295.7 529.7L305.1 536.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M751.5 558.6L586.7 731.9L573.7 637.4L721.2 482.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M512.9 741.5L277.5 620.1L305.1 536.3L515.7 645Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M586.7 731.9L575.2 740.7L564.6 644.3L573.7 637.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M575.2 740.7L560.5 746.4L553.1 648.8L564.6 644.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M527.8 746.9L512.9 741.5L515.7 645L527.4 649.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M560.5 746.4L544.2 748.6L540.3 650.5L553.1 648.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M544.2 748.6L527.8 746.9L527.4 649.2L540.3 650.5Z" fill={`url(#${uid}gCapSide)`} />
            <g transform="matrix(1.5489 0.7987 -1.0846 1.1407 508 487.9883)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="5" opacity="0" transform="translate(512 512) scale(1.2389) translate(-508 -525.4)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.222" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M729.7 554.5L742.7 562.9L751.9 574.1L756.3 587L755.6 600.5L749.9 613.1L608.9 816.4L598.6 826.9L584.8 834.4L568.8 838L552.3 837.4L536.8 832.8L286.3 718.3L273.3 710L264.1 698.8L259.7 685.8L260.4 672.4L266.1 659.8L407.1 456.5L417.4 445.9L431.2 438.5L447.2 434.9L463.7 435.4L479.2 440.1Z" opacity="0.222" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M796.4 619.5L588.7 919.2L219.6 750.5L427.3 450.9Z" fill={`url(#${uid}gBase)`} />
          <path d="M796.4 679.2L588.7 978.8L588.7 919.2L796.4 619.5Z" className="adk-hull-r" />
          <path d="M588.7 978.8L219.6 810.1L219.6 750.5L588.7 919.2Z" className="adk-hull-l" />
          <path d="M698.6 593.2L561.3 791.1L317.4 679.7L454.7 481.7Z" fill={`url(#${uid}gUpper)`} />
          <path d="M698.6 641.7L561.3 839.7L561.3 791.1L698.6 593.2Z" className="adk-neck-r" />
          <path d="M557.7 599.2L521.4 582.7L521.4 525.2L557.7 541.8Z" className="adk-stem-4" />
          <path d="M521.4 582.7L500.1 613.4L500.1 556L521.4 525.2Z" className="adk-stem-4" />
          <path d="M500.1 613.4L462.2 596.1L462.2 538.7L500.1 556Z" className="adk-stem-3" />
          <path d="M462.2 596.1L441.8 625.5L441.8 568.1L462.2 538.7Z" className="adk-stem-3" />
          <path d="M561.3 839.7L317.4 728.3L317.4 679.7L561.3 791.1Z" className="adk-neck-l" />
          <path d="M574.2 647.3L536.3 630L536.3 572.6L574.2 589.9Z" className="adk-stem-1" />
          <path d="M479.7 642.9L458.3 673.6L458.3 616.2L479.7 585.4Z" className="adk-stem-2" />
          <path d="M574.2 589.9L536.3 572.6L557.7 541.8L521.4 525.2L500.1 556L462.2 538.7L441.8 568.1L479.7 585.4L458.3 616.2L494.6 632.8L515.9 602L553.8 619.3Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M751.9 523.3L756.3 536.2L724.4 477.9L720.9 467.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M756.3 536.2L755.6 549.7L723.9 488.5L724.4 477.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M755.6 549.7L749.9 562.3L719.4 498.4L723.9 488.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M260.4 621.6L266.1 609L296.6 544.8L292.1 554.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M259.7 635L260.4 621.6L292.1 554.7L291.6 565.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M264.1 648L259.7 635L291.6 565.2L295.1 575.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M703.5 452.4L713.7 459L720.9 467.8L724.4 477.9L723.9 488.5L719.4 498.4L593.2 680.3L585.1 688.6L574.3 694.4L561.8 697.3L548.8 696.9L536.6 693.2L312.5 590.8L302.3 584.2L295.1 575.4L291.6 565.2L292.1 554.7L296.6 544.8L422.8 362.9L430.9 354.6L441.7 348.7L454.2 345.9L467.2 346.3L479.4 350Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M665.6 463.3L674.9 469.2L681.4 477.2L684.6 486.5L684.1 496.1L680 505.1L579.8 649.5L572.5 657.1L562.7 662.4L551.3 665L539.4 664.6L528.3 661.2L350.4 579.9L341.1 574L334.6 566L331.4 556.7L331.9 547.1L336 538.1L436.2 393.6L443.5 386.1L453.3 380.8L464.7 378.2L476.6 378.6L487.7 381.9Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <path d="M273.3 659.2L264.1 648L295.1 575.4L302.3 584.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M286.3 667.5L273.3 659.2L302.3 584.2L312.5 590.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M749.9 562.3L608.9 765.6L593.2 680.3L719.4 498.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M536.8 782L286.3 667.5L312.5 590.8L536.6 693.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M608.9 765.6L598.6 776.1L585.1 688.6L593.2 680.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M598.6 776.1L584.8 783.6L574.3 694.4L585.1 688.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M552.3 786.7L536.8 782L536.6 693.2L548.8 696.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M584.8 783.6L568.8 787.2L561.8 697.3L574.3 694.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M568.8 787.2L552.3 786.7L548.8 696.9L561.8 697.3Z" fill={`url(#${uid}gCapSide)`} />
            <g transform="matrix(1.6478 0.7529 -0.9275 1.3376 508 521.5884)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="6" opacity="0" transform="translate(512 512) scale(1.3) translate(-508 -547.1)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.100" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M716 544.6L730.1 552.3L740.9 563.5L747.2 577.1L748.5 591.7L744.7 606L634.7 841.8L626 854.4L613.4 863.9L598.1 869.6L581.6 870.7L565.5 867.3L300 769.6L285.9 761.9L275.1 750.7L268.8 737.2L267.5 722.5L271.3 708.2L381.3 472.4L390 459.8L402.6 450.3L417.9 444.6L434.4 443.5L450.5 446.9Z" opacity="0.100" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M784.7 640.5L622.6 988L622.6 941.1L784.7 593.6Z" className="adk-hull-r" />
          <path d="M784.7 593.6L622.6 941.1L231.3 797.1L393.4 449.6Z" fill={`url(#${uid}gBase)`} />
          <path d="M622.6 988L231.3 844.1L231.3 797.1L622.6 941.1Z" className="adk-hull-l" />
          <path d="M690.8 628.1L583.7 857.7L583.7 819.5L690.8 589.9Z" className="adk-neck-r" />
          <path d="M690.8 589.9L583.7 819.5L325.2 724.4L432.3 494.7Z" fill={`url(#${uid}gUpper)`} />
          <path d="M551.8 611.4L513.4 597.3L513.4 552.1L551.8 566.2Z" className="adk-stem-4" />
          <path d="M513.4 597.3L496.7 633L496.7 587.8L513.4 552.1Z" className="adk-stem-4" />
          <path d="M583.7 857.7L325.2 762.6L325.2 724.4L583.7 819.5Z" className="adk-neck-l" />
          <path d="M496.7 633L456.6 618.2L456.6 573L496.7 587.8Z" className="adk-stem-3" />
          <path d="M456.6 618.2L440.6 652.3L440.6 607.1L456.6 573Z" className="adk-stem-3" />
          <path d="M575.4 661.9L535.2 647.1L535.2 601.9L575.4 616.7Z" className="adk-stem-1" />
          <path d="M480.8 667.1L464.2 702.8L464.2 657.6L480.8 621.9Z" className="adk-stem-2" />
          <path d="M575.4 616.7L535.2 601.9L551.8 566.2L513.4 552.1L496.7 587.8L456.6 573L440.6 607.1L480.8 621.9L464.2 657.6L502.6 671.7L519.3 636L559.4 650.8Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M740.9 523.5L747.2 537.1L716.4 496.3L711.5 485.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M747.2 537.1L748.5 551.7L717.5 507.8L716.4 496.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M271.3 668.2L381.3 432.4L400 403.4L301.6 614.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M748.5 551.7L744.7 566L714.4 519L717.5 507.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M267.5 682.5L271.3 668.2L301.6 614.4L298.5 625.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M744.7 566L634.7 801.9L616 730L714.4 519Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M268.8 697.2L267.5 682.5L298.5 625.6L299.6 637.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M275.1 710.8L268.8 697.2L299.6 637.1L304.5 647.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M285.9 721.9L275.1 710.8L304.5 647.8L313 656.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M691.9 470.8L703 476.8L711.5 485.6L716.4 496.3L717.5 507.8L714.4 519L616 730L609.2 739.9L599.3 747.4L587.3 751.8L574.3 752.7L561.7 750L324.1 662.6L313 656.6L304.5 647.8L299.6 637.1L298.5 625.6L301.6 614.4L400 403.4L406.8 393.5L416.7 386L428.7 381.6L441.7 380.7L454.3 383.4Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M655.9 486.6L666 492.1L673.7 500.1L678.2 509.8L679.1 520.3L676.4 530.5L598.2 698L592 707L583 713.8L572.1 717.8L560.3 718.7L548.8 716.2L360.1 646.8L350 641.3L342.3 633.3L337.8 623.6L336.9 613.1L339.6 602.9L417.8 435.4L424 426.4L433 419.6L443.9 415.6L455.7 414.7L467.2 417.2Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <path d="M300 729.6L285.9 721.9L313 656.6L324.1 662.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M565.5 827.3L300 729.6L324.1 662.6L561.7 750Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M634.7 801.9L626 814.4L609.2 739.9L616 730Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M626 814.4L613.4 824L599.3 747.4L609.2 739.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M613.4 824L598.1 829.6L587.3 751.8L599.3 747.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M581.6 830.7L565.5 827.3L561.7 750L574.3 752.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M598.1 829.6L581.6 830.7L574.3 752.7L587.3 751.8Z" fill={`url(#${uid}gCapSide)`} />
            <g transform="matrix(1.747 0.6426 -0.7236 1.5514 508 566.7044)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="7" opacity="0" transform="translate(512 512) scale(1.3611) translate(-508 -584.9)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.000" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M699.4 536.9L714.4 543.5L726.6 554.1L734.7 567.7L738 583.1L736.1 598.6L658.7 860.3L651.8 874.6L640.6 886.1L626.1 893.8L609.9 896.9L593.4 895.1L316.6 821.9L301.6 815.4L289.4 804.7L281.3 791.1L278 775.7L279.9 760.2L357.3 498.5L364.2 484.2L375.4 472.7L389.9 465L406.1 461.9L422.6 463.8Z" opacity="0.000" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M769 600.9L654.9 986.5L654.9 953.3L769 567.6Z" className="adk-hull-r" />
          <path d="M769 567.6L654.9 953.3L247 845.4L361.1 459.7Z" fill={`url(#${uid}gBase)`} />
          <path d="M654.9 986.5L247 878.7L247 845.4L654.9 953.3Z" className="adk-hull-l" />
          <path d="M680.4 614.7L605.1 869.5L605.1 842.5L680.4 587.6Z" className="adk-neck-r" />
          <path d="M680.4 587.6L605.1 842.5L335.6 771.2L410.9 516.4Z" fill={`url(#${uid}gUpper)`} />
          <path d="M605.1 869.5L335.6 798.3L335.6 771.2L605.1 842.5Z" className="adk-neck-l" />
          <path d="M545.3 626.2L505.3 615.6L505.3 583.6L545.3 594.1Z" className="adk-stem-4" />
          <path d="M505.3 615.6L493.6 655.2L493.6 623.2L505.3 583.6Z" className="adk-stem-4" />
          <path d="M493.6 655.2L451.7 644.1L451.7 612.1L493.6 623.2Z" className="adk-stem-3" />
          <path d="M451.7 644.1L440.5 682L440.5 650L451.7 612.1Z" className="adk-stem-3" />
          <path d="M575.5 676.8L533.6 665.8L533.6 633.7L575.5 644.8Z" className="adk-stem-1" />
          <path d="M482.4 693.1L470.7 732.7L470.7 700.6L482.4 661Z" className="adk-stem-2" />
          <path d="M575.5 644.8L533.6 633.7L545.3 594.1L505.3 583.6L493.6 623.2L451.7 612.1L440.5 650L482.4 661L470.7 700.6L510.7 711.2L522.4 671.6L564.3 682.7Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M364.2 455.9L375.4 444.4L393 434.7L384.2 443.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M357.3 470.2L364.2 455.9L384.2 443.8L378.7 455Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M714.4 515.1L726.6 525.8L699.1 506.6L689.5 498.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M726.6 525.8L734.7 539.4L705.5 517.3L699.1 506.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M734.7 539.4L738 554.8L708 529.4L705.5 517.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M738 554.8L736.1 570.3L706.5 541.6L708 529.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M279.9 731.9L357.3 470.2L378.7 455L309.5 689.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M736.1 570.3L658.7 832L637.3 775.8L706.5 541.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M278 747.4L279.9 731.9L309.5 689.1L308 701.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M281.3 762.8L278 747.4L308 701.3L310.5 713.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M289.4 776.4L281.3 762.8L310.5 713.4L316.9 724.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M301.6 787L289.4 776.4L316.9 724.1L326.5 732.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M316.6 793.6L301.6 787L326.5 732.5L338.3 737.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M677.7 493.2L689.5 498.3L699.1 506.6L705.5 517.3L708 529.4L706.5 541.6L637.3 775.8L631.8 787L623 796L611.7 802.1L598.9 804.5L586 803.1L338.3 737.6L326.5 732.5L316.9 724.1L310.5 713.4L308 701.3L309.5 689.1L378.7 455L384.2 443.8L393 434.7L404.3 428.7L417.1 426.2L430 427.7Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M644 514L654.8 518.6L663.5 526.2L669.3 535.9L671.6 546.9L670.3 558L615.3 744L610.3 754.1L602.3 762.4L592 767.9L580.4 770.1L568.6 768.8L372 716.8L361.2 712.1L352.5 704.5L346.7 694.8L344.4 683.8L345.7 672.7L400.7 486.8L405.7 476.6L413.7 468.4L424 462.9L435.6 460.7L447.4 462Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <path d="M593.4 866.7L316.6 793.6L338.3 737.6L586 803.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M658.7 832L651.8 846.3L631.8 787L637.3 775.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M651.8 846.3L640.6 857.8L623 796L631.8 787Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M640.6 857.8L626.1 865.5L611.7 802.1L623 796Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M626.1 865.5L609.9 868.6L598.9 804.5L611.7 802.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M609.9 868.6L593.4 866.7L586 803.1L598.9 804.5Z" fill={`url(#${uid}gCapSide)`} />
            <g transform="matrix(1.821 0.4815 -0.5093 1.7218 508 615.3691)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="8" opacity="0" transform="translate(512 512) scale(1.4111) translate(-508 -628.3)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.000" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M683.7 533.6L699.3 538.9L712.6 548.6L722.1 561.9L726.9 577.4L726.6 593.6L676.7 870.3L671.3 885.6L661.3 898.5L647.8 907.8L631.9 912.5L615.4 912.3L332.3 863.5L316.7 858.2L303.4 848.4L293.9 835.2L289.1 819.7L289.4 803.5L339.3 526.8L344.7 511.5L354.7 498.6L368.2 489.3L384.1 484.5L400.6 484.8Z" opacity="0.000" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M753.3 569.7L679.8 977.4L679.8 955.9L753.3 548.1Z" className="adk-hull-r" />
          <path d="M679.8 977.4L262.7 905.5L262.7 884L679.8 955.9Z" className="adk-hull-l" />
          <path d="M753.3 548.1L679.8 955.9L262.7 884L336.2 476.2Z" fill={`url(#${uid}gBase)`} />
          <path d="M670.1 605.1L621.5 874.5L621.5 857L670.1 587.6Z" className="adk-neck-r" />
          <path d="M621.5 874.5L345.9 827L345.9 809.5L621.5 857Z" className="adk-neck-l" />
          <path d="M670.1 587.6L621.5 857L345.9 809.5L394.5 540.1Z" fill={`url(#${uid}gUpper)`} />
          <path d="M539.6 640.2L498.7 633.1L498.7 612.4L539.6 619.5Z" className="adk-stem-4" />
          <path d="M498.7 633.1L491.1 675L491.1 654.3L498.7 612.4Z" className="adk-stem-4" />
          <path d="M491.1 675L448.3 667.6L448.3 646.9L491.1 654.3Z" className="adk-stem-3" />
          <path d="M574.9 689.4L532.1 682L532.1 661.3L574.9 668.7Z" className="adk-stem-1" />
          <path d="M448.3 667.6L441.1 707.7L441.1 686.9L448.3 646.9Z" className="adk-stem-3" />
          <path d="M483.9 715L476.4 756.9L476.4 736.2L483.9 694.3Z" className="adk-stem-2" />
          <path d="M574.9 668.7L532.1 661.3L539.6 619.5L498.7 612.4L491.1 654.3L448.3 646.9L441.1 686.9L483.9 694.3L476.4 736.2L517.3 743.2L524.9 701.4L567.7 708.8Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M384.1 466.2L400.6 466.5L410.9 471.4L397.9 471.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M368.2 471L384.1 466.2L397.9 471.2L385.5 474.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M354.7 480.2L368.2 471L385.5 474.9L374.8 482.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M344.7 493.2L354.7 480.2L374.8 482.2L367 492.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M400.6 466.5L683.7 515.3L664.2 515.1L410.9 471.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M339.3 508.5L344.7 493.2L367 492.4L362.7 504.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M683.7 515.3L699.3 520.6L676.5 519.2L664.2 515.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M699.3 520.6L712.6 530.3L686.9 526.9L676.5 519.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M712.6 530.3L722.1 543.6L694.3 537.3L686.9 526.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M722.1 543.6L726.9 559.1L698.2 549.5L694.3 537.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M726.9 559.1L726.6 575.2L697.9 562.2L698.2 549.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M289.4 785.2L339.3 508.5L362.7 504.4L318.1 752Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M726.6 575.2L676.7 851.9L653.3 809.8L697.9 562.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M289.1 801.4L289.4 785.2L318.1 752L317.8 764.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M293.9 816.9L289.1 801.4L317.8 764.7L321.7 776.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M303.4 830.1L293.9 816.9L321.7 776.9L329.1 787.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M316.7 839.9L303.4 830.1L329.1 787.3L339.5 795Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M332.3 845.1L316.7 839.9L339.5 795L351.8 799.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M676.7 851.9L671.3 867.3L649 821.8L653.3 809.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M615.4 893.9L332.3 845.1L351.8 799.1L605.1 842.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M671.3 867.3L661.3 880.2L641.2 832L649 821.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M661.3 880.2L647.8 889.5L630.5 839.3L641.2 832Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M647.8 889.5L631.9 894.2L618.1 843L630.5 839.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M631.9 894.2L615.4 893.9L605.1 842.8L618.1 843Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M664.2 515.1L676.5 519.2L686.9 526.9L694.3 537.3L698.2 549.5L697.9 562.2L653.3 809.8L649 821.8L641.2 832L630.5 839.3L618.1 843L605.1 842.8L351.8 799.1L339.5 795L329.1 787.3L321.7 776.9L317.8 764.7L318.1 752L362.7 504.4L367 492.4L374.8 482.2L385.5 474.9L397.9 471.2L410.9 471.4Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M632.9 539.7L644 543.5L653.5 550.5L660.3 559.9L663.7 571L663.5 582.6L628.1 779.2L624.2 790.1L617.1 799.3L607.4 806L596.1 809.3L584.3 809.1L383.1 774.5L372 770.7L362.5 763.8L355.7 754.3L352.3 743.2L352.5 731.7L387.9 535.1L391.8 524.1L398.9 514.9L408.6 508.2L419.9 504.9L431.7 505.1Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <g transform="matrix(1.8622 0.321 -0.3284 1.8204 508 657.1042)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="9" opacity="0" transform="translate(512 512) scale(1.45) translate(-508 -670)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.000" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M670.3 533.4L686.3 537.6L700.3 546.5L710.8 559.2L716.8 574.5L717.8 590.9L689.6 874.9L685.4 890.8L676.5 904.7L663.7 915.1L648.3 921.1L631.7 922.1L345.7 894.1L329.7 890L315.7 881.1L305.2 868.4L299.2 853.1L298.2 836.6L326.4 552.6L330.6 536.7L339.5 522.9L352.3 512.4L367.7 506.4L384.3 505.5Z" opacity="0.000" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M739.5 547.2L698 965.7L698 953.6L739.5 535Z" className="adk-hull-r" />
          <path d="M698 965.7L276.5 924.5L276.5 912.3L698 953.6Z" className="adk-hull-l" />
          <path d="M739.5 535L698 953.6L276.5 912.3L318 493.8Z" fill={`url(#${uid}gBase)`} />
          <path d="M661 599L633.5 875.6L633.5 865.7L661 589.1Z" className="adk-neck-r" />
          <path d="M633.5 875.6L355 848.3L355 838.4L633.5 865.7Z" className="adk-neck-l" />
          <path d="M661 589.1L633.5 865.7L355 838.4L382.5 561.9Z" fill={`url(#${uid}gUpper)`} />
          <path d="M535 652.3L493.6 648.2L493.6 636.5L535 640.6Z" className="adk-stem-4" />
          <path d="M493.6 648.2L489.3 691.2L489.3 679.5L493.6 636.5Z" className="adk-stem-4" />
          <path d="M489.3 691.2L446.1 687L446.1 675.3L489.3 679.5Z" className="adk-stem-3" />
          <path d="M574 699.5L530.7 695.2L530.7 683.5L574 687.8Z" className="adk-stem-1" />
          <path d="M446.1 687L442 728.1L442 716.4L446.1 675.3Z" className="adk-stem-3" />
          <path d="M485.3 732.3L481 775.3L481 763.6L485.3 720.6Z" className="adk-stem-2" />
          <path d="M574 687.8L530.7 683.5L535 640.6L493.6 636.5L489.3 679.5L446.1 675.3L442 716.4L485.3 720.6L481 763.6L522.4 767.6L526.7 724.6L569.9 728.9Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M367.7 496.1L384.3 495.1L396.7 509.7L383.7 510.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M352.3 502.1L367.7 496.1L383.7 510.4L371.6 515.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M339.5 512.5L352.3 502.1L371.6 515.2L361.5 523.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M384.3 495.1L670.3 523.1L652.6 534.7L396.7 509.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M330.6 526.4L339.5 512.5L361.5 523.3L354.5 534.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M670.3 523.1L686.3 527.2L665.2 538L652.6 534.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M686.3 527.2L700.3 536.1L676.2 544.9L665.2 538Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M326.4 542.3L330.6 526.4L354.5 534.2L351.2 546.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M700.3 536.1L710.8 548.8L684.5 554.9L676.2 544.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M710.8 548.8L716.8 564.1L689.2 567L684.5 554.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M716.8 564.1L717.8 580.6L690 579.9L689.2 567Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M298.2 826.3L326.4 542.3L351.2 546.7L326 800.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M717.8 580.6L689.6 864.6L664.8 834L690 579.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M299.2 842.7L298.2 826.3L326 800.8L326.8 813.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M305.2 858L299.2 842.7L326.8 813.7L331.5 825.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M315.7 870.7L305.2 858L331.5 825.8L339.8 835.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M689.6 864.6L685.4 880.5L661.5 846.5L664.8 834Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M329.7 879.6L315.7 870.7L339.8 835.8L350.8 842.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M345.7 883.7L329.7 879.6L350.8 842.7L363.4 846Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M685.4 880.5L676.5 894.3L654.5 857.3L661.5 846.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M631.7 911.7L345.7 883.7L363.4 846L619.3 871Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M676.5 894.3L663.7 904.8L644.4 865.5L654.5 857.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M663.7 904.8L648.3 910.7L632.3 870.3L644.4 865.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M648.3 910.7L631.7 911.7L619.3 871L632.3 870.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M652.6 534.7L665.2 538L676.2 544.9L684.5 554.9L689.2 567L690 579.9L664.8 834L661.5 846.5L654.5 857.3L644.4 865.5L632.3 870.3L619.3 871L363.4 846L350.8 842.7L339.8 835.8L331.5 825.8L326.8 813.7L326 800.8L351.2 546.7L354.5 534.2L361.5 523.3L371.6 515.2L383.7 510.4L396.7 509.7Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M623.3 562L634.8 565L644.7 571.3L652.3 580.4L656.6 591.3L657.3 603.1L637.2 804.9L634.3 816.2L627.9 826.1L618.7 833.6L607.7 837.9L595.9 838.5L392.7 818.7L381.2 815.7L371.3 809.4L363.7 800.3L359.4 789.4L358.7 777.6L378.8 575.8L381.7 564.5L388.1 554.6L397.3 547.1L408.3 542.8L420.1 542.2Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <g transform="matrix(1.8818 0.184 -0.1853 1.8684 508 690.3492)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="10" opacity="0" transform="translate(512 512) scale(1.4777) translate(-508 -704)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.000" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M660.1 534.8L676.4 538.1L690.8 546.3L702 558.5L708.9 573.5L710.7 590L698.2 876.7L694.9 892.9L686.7 907.3L674.5 918.5L659.5 925.3L643 927.2L355.9 914.7L339.6 911.4L325.2 903.3L314 891.1L307.1 876L305.3 859.6L317.8 572.8L321.1 556.6L329.3 542.2L341.5 531.1L356.5 524.2L373 522.3Z" opacity="0.000" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M728.8 532.5L710.3 955.1L710.3 949.7L728.8 527.1Z" className="adk-hull-r" />
          <path d="M710.3 955.1L287.2 936.7L287.2 931.2L710.3 949.7Z" className="adk-hull-l" />
          <path d="M728.8 527.1L710.3 949.7L287.2 931.2L305.7 508.7Z" fill={`url(#${uid}gBase)`} />
          <path d="M653.9 595.7L641.7 874.9L641.7 870.5L653.9 591.3Z" className="adk-neck-r" />
          <path d="M641.7 874.9L362.1 862.7L362.1 858.3L641.7 870.5Z" className="adk-neck-l" />
          <path d="M653.9 591.3L641.7 870.5L362.1 858.3L374.3 579.1Z" fill={`url(#${uid}gUpper)`} />
          <path d="M531.6 661.5L490 659.7L490 654.5L531.6 656.3Z" className="adk-stem-4" />
          <path d="M490 659.7L488.1 703.1L488.1 697.9L490 654.5Z" className="adk-stem-4" />
          <path d="M488.1 703.1L444.7 701.2L444.7 696L488.1 697.9Z" className="adk-stem-3" />
          <path d="M573.1 706.8L529.7 704.9L529.7 699.7L573.1 701.6Z" className="adk-stem-1" />
          <path d="M444.7 701.2L442.9 742.7L442.9 737.5L444.7 696Z" className="adk-stem-3" />
          <path d="M486.3 744.6L484.4 788L484.4 782.8L486.3 739.4Z" className="adk-stem-2" />
          <path d="M573.1 701.6L529.7 699.7L531.6 656.3L490 654.5L488.1 697.9L444.7 696L442.9 737.5L486.3 739.4L484.4 782.8L526 784.6L527.9 741.2L571.3 743.1Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M356.5 519.6L373 517.7L387 539L374 540.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M341.5 526.4L356.5 519.6L374 540.4L362.2 545.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M373 517.7L660.1 530.2L643.9 550.2L387 539Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M329.3 537.6L341.5 526.4L362.2 545.8L352.6 554.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M660.1 530.2L676.4 533.5L656.6 552.8L643.9 550.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M676.4 533.5L690.8 541.7L668 559.2L656.6 552.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M321.1 552L329.3 537.6L352.6 554.6L346.2 565.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M690.8 541.7L702 553.9L676.8 568.7L668 559.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M317.8 568.2L321.1 552L346.2 565.9L343.6 578.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M702 553.9L708.9 568.9L682.2 580.6L676.8 568.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M708.9 568.9L710.7 585.4L683.6 593.5L682.2 580.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M305.3 855L317.8 568.2L343.6 578.7L332.4 835.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M710.7 585.4L698.2 872.1L672.4 850L683.6 593.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M307.1 871.4L305.3 855L332.4 835.2L333.8 848.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M314 886.4L307.1 871.4L333.8 848.1L339.2 859.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M698.2 872.1L694.9 888.3L669.8 862.8L672.4 850Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M325.2 898.6L314 886.4L339.2 859.9L348 869.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M694.9 888.3L686.7 902.7L663.4 874.1L669.8 862.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M339.6 906.8L325.2 898.6L348 869.5L359.4 875.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M355.9 910.1L339.6 906.8L359.4 875.9L372.1 878.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M686.7 902.7L674.5 913.9L653.8 882.9L663.4 874.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M643 922.6L355.9 910.1L372.1 878.5L629 889.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M674.5 913.9L659.5 920.7L642 888.2L653.8 882.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M659.5 920.7L643 922.6L629 889.7L642 888.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M643.9 550.2L656.6 552.8L668 559.2L676.8 568.7L682.2 580.6L683.6 593.5L672.4 850L669.8 862.8L663.4 874.1L653.8 882.9L642 888.2L629 889.7L372.1 878.5L359.4 875.9L348 869.5L339.2 859.9L333.8 848.1L332.4 835.2L343.6 578.7L346.2 565.9L352.6 554.6L362.2 545.8L374 540.4L387 539Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M616.1 579.2L627.7 581.5L638 587.4L646 596.1L650.9 606.8L652.2 618.6L643.3 822.3L641 833.9L635.2 844.2L626.4 852.1L615.7 857L603.9 858.4L399.9 849.5L388.3 847.1L378 841.3L370 832.6L365.1 821.9L363.8 810.1L372.7 606.4L375 594.8L380.8 584.5L389.6 576.5L400.3 571.6L412.1 570.3Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <g transform="matrix(1.8891 0.0824 -0.0825 1.8864 508 714.3407)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="11" opacity="0" transform="translate(512 512) scale(1.4944) translate(-508 -726)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.000" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M653.8 536.3L670.2 539.1L684.9 546.8L696.4 558.6L703.8 573.5L706.2 589.8L703.1 877.2L700.3 893.6L692.6 908.2L680.8 919.8L665.9 927.2L649.6 929.6L362.2 926.4L345.8 923.7L331.1 916L319.6 904.2L312.2 889.3L309.8 872.9L312.9 585.6L315.7 569.2L323.4 554.6L335.2 543L350.1 535.6L366.4 533.2Z" opacity="0.000" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M722.1 524.4L717.5 947.9L717.5 946.6L722.1 523.1Z" className="adk-hull-r" />
          <path d="M717.5 947.9L293.9 943.3L293.9 941.9L717.5 946.6Z" className="adk-hull-l" />
          <path d="M722.1 523.1L717.5 946.6L293.9 941.9L298.5 518.4Z" fill={`url(#${uid}gBase)`} />
          <path d="M649.4 594.1L646.4 873.9L646.4 872.8L649.4 593Z" className="adk-neck-r" />
          <path d="M646.4 873.9L366.6 870.9L366.6 869.8L646.4 872.8Z" className="adk-neck-l" />
          <path d="M649.4 593L646.4 872.8L366.6 869.8L369.6 590Z" fill={`url(#${uid}gUpper)`} />
          <path d="M529.5 667.3L487.9 666.9L487.9 665.6L529.5 666Z" className="adk-stem-4" />
          <path d="M487.9 666.9L487.4 710.4L487.4 709.1L487.9 665.6Z" className="adk-stem-4" />
          <path d="M487.4 710.4L443.9 709.9L443.9 708.6L487.4 709.1Z" className="adk-stem-3" />
          <path d="M572.5 711.3L529 710.8L529 709.5L572.5 710Z" className="adk-stem-1" />
          <path d="M443.9 709.9L443.5 751.5L443.5 750.2L443.9 708.6Z" className="adk-stem-3" />
          <path d="M487 752L486.5 795.4L486.5 794.1L487 750.7Z" className="adk-stem-2" />
          <path d="M572.5 710L529 709.5L529.5 666L487.9 665.6L487.4 709.1L443.9 708.6L443.5 750.2L487 750.7L486.5 794.1L528.1 794.6L528.6 751.1L572.1 751.6Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M350.1 534.5L366.4 532L381.3 557.2L368.4 559.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M366.4 532L653.8 535.2L638.4 560L381.3 557.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M653.8 535.2L670.2 538L651.3 562.2L638.4 560Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M335.2 541.8L350.1 534.5L368.4 559.1L356.7 564.9Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M670.2 538L684.9 545.6L662.8 568.2L651.3 562.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M323.4 553.4L335.2 541.8L356.7 564.9L347.4 574Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M684.9 545.6L696.4 557.5L671.9 577.5L662.8 568.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M315.7 568.1L323.4 553.4L347.4 574L341.4 585.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M696.4 557.5L703.8 572.3L677.7 589.2L671.9 577.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M312.9 584.4L315.7 568.1L341.4 585.5L339.2 598.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M703.8 572.3L706.2 588.7L679.6 602.1L677.7 589.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M309.8 871.8L312.9 584.4L339.2 598.4L336.4 855.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M706.2 588.7L703.1 876.1L676.8 859.2L679.6 602.1Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M312.2 888.2L309.8 871.8L336.4 855.5L338.3 868.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M703.1 876.1L700.3 892.4L674.6 872L676.8 859.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M319.6 903L312.2 888.2L338.3 868.4L344.1 880Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M700.3 892.4L692.6 907.1L668.6 883.6L674.6 872Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M331.1 914.8L319.6 903L344.1 880L353.2 889.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M692.6 907.1L680.8 918.7L659.3 892.7L668.6 883.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M345.8 922.5L331.1 914.8L353.2 889.3L364.7 895.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M680.8 918.7L665.9 926L647.6 898.4L659.3 892.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M362.2 925.3L345.8 922.5L364.7 895.4L377.6 897.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M649.6 928.4L362.2 925.3L377.6 897.5L634.7 900.3Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M665.9 926L649.6 928.4L634.7 900.3L647.6 898.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M638.4 560L651.3 562.2L662.8 568.2L671.9 577.5L677.7 589.2L679.6 602.1L676.8 859.2L674.6 872L668.6 883.6L659.3 892.7L647.6 898.4L634.7 900.3L377.6 897.5L364.7 895.4L353.2 889.3L344.1 880L338.3 868.4L336.4 855.5L339.2 598.4L341.4 585.5L347.4 574L356.7 564.9L368.4 559.1L381.3 557.2Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M611.6 590L623.3 592L633.8 597.5L642.1 605.9L647.3 616.5L649 628.2L646.8 832.4L644.8 844.1L639.3 854.5L630.9 862.8L620.3 868.1L608.6 869.8L404.4 867.6L392.7 865.6L382.2 860.1L373.9 851.7L368.7 841.1L367 829.4L369.2 625.2L371.2 613.5L376.7 603L385.1 594.7L395.7 589.5L407.4 587.8Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <g transform="matrix(1.8908 0.0206 -0.0206 1.8906 508 728.7831)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
        <g data-frame="12" opacity="0" transform="translate(512 512) scale(1.5) translate(-508 -733.6)">
          <ellipse cx="508" cy="806" rx="330" ry="86" opacity="0.000" filter={`url(#${uid}anSoft)`} className="adk-shade" />
          <path d="M651.7 536.9L668.1 539.5L682.8 547.1L694.5 558.8L702.1 573.5L704.7 589.9L704.7 877.3L702.1 893.7L694.5 908.4L682.8 920.1L668.1 927.7L651.7 930.3L364.3 930.3L347.9 927.7L333.2 920.1L321.5 908.4L313.9 893.7L311.3 877.3L311.3 589.9L313.9 573.5L321.5 558.8L333.2 547.1L347.9 539.5L364.3 536.9Z" opacity="0.000" filter={`url(#${uid}anSoft2)`} className="adk-shade" />
          <path d="M719.8 521.8L719.8 945.4L296.2 945.4L296.2 521.8Z" fill={`url(#${uid}gBase)`} />
          <path d="M647.9 593.7L647.9 873.5L368.1 873.5L368.1 593.7Z" fill={`url(#${uid}gUpper)`} />
          <path d="M572.3 712.8L528.8 712.8L528.8 669.3L487.2 669.3L487.2 712.8L443.7 712.8L443.7 754.4L487.2 754.4L487.2 797.9L528.8 797.9L528.8 754.4L572.3 754.4Z" className="adk-stem-top" />
          <g data-cap-face="1">
            <path d="M651.7 536.9L668.1 539.5L649.4 565.5L636.6 563.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M668.1 539.5L682.8 547.1L661 571.4L649.4 565.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M682.8 547.1L694.5 558.8L670.2 580.6L661 571.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M694.5 558.8L702.1 573.5L676.1 592.2L670.2 580.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M702.1 573.5L704.7 589.9L678.2 605L676.1 592.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M704.7 589.9L704.7 877.3L678.2 862.2L678.2 605Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M704.7 877.3L702.1 893.7L676.1 875L678.2 862.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M702.1 893.7L694.5 908.4L670.2 886.6L676.1 875Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M694.5 908.4L682.8 920.1L661 895.8L670.2 886.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M682.8 920.1L668.1 927.7L649.4 901.7L661 895.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M668.1 927.7L651.7 930.3L636.6 903.8L649.4 901.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M651.7 930.3L364.3 930.3L379.4 903.8L636.6 903.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M364.3 930.3L347.9 927.7L366.6 901.7L379.4 903.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M347.9 927.7L333.2 920.1L355 895.8L366.6 901.7Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M333.2 920.1L321.5 908.4L345.8 886.6L355 895.8Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M321.5 908.4L313.9 893.7L339.9 875L345.8 886.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M313.9 893.7L311.3 877.3L337.8 862.2L339.9 875Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M311.3 877.3L311.3 589.9L337.8 605L337.8 862.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M311.3 589.9L313.9 573.5L339.9 592.2L337.8 605Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M313.9 573.5L321.5 558.8L345.8 580.6L339.9 592.2Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M321.5 558.8L333.2 547.1L355 571.4L345.8 580.6Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M333.2 547.1L347.9 539.5L366.6 565.5L355 571.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M347.9 539.5L364.3 536.9L379.4 563.4L366.6 565.5Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M364.3 536.9L651.7 536.9L636.6 563.4L379.4 563.4Z" fill={`url(#${uid}gCapSide)`} />
            <path d="M636.6 563.4L649.4 565.5L661 571.4L670.2 580.6L676.1 592.2L678.2 605L678.2 862.2L676.1 875L670.2 886.6L661 895.8L649.4 901.7L636.6 903.8L379.4 903.8L366.6 901.7L355 895.8L345.8 886.6L339.9 875L337.8 862.2L337.8 605L339.9 592.2L345.8 580.6L355 571.4L366.6 565.5L379.4 563.4Z" fill={`url(#${uid}gCapTop)`} strokeOpacity="0.30" strokeWidth="3" className="adk-sheen" />
            <path d="M610.1 593.7L621.8 595.5L632.3 600.9L640.7 609.3L646.1 619.8L647.9 631.5L647.9 835.7L646.1 847.4L640.7 857.9L632.3 866.3L621.8 871.7L610.1 873.5L405.9 873.5L394.2 871.7L383.7 866.3L375.3 857.9L369.9 847.4L368.1 835.7L368.1 631.5L369.9 619.8L375.3 609.3L383.7 600.9L394.2 595.5L405.9 593.7Z" fill={`url(#${uid}gDish)`} strokeOpacity="0.10" strokeWidth="2" className="adk-sheen" />
            <g transform="matrix(1.8909 0 0 1.8909 508 733.6)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fontSize="106" fillOpacity="0.92" className="adk-legend">A</text>
            </g>
          </g>
        </g>
      </g>
    </g>
    </svg>
  )
}

export default AnydeckIconArt
