/* Every number on this site lives here, and every one of them is copied from
   NASA SCaN's "Lunar Communications, PNT and Observability Industry Demand
   Signal" (August 28, 2026). Each group names the table it came from so a
   reviewer can check it against the PDF line by line. Nothing below is
   extrapolated. The only values that are not NASA's are the "for scale"
   comparisons in SCALE, and the page labels those as mine wherever they appear. */
window.DEMAND = {
  source: {
    title: "Lunar Communications, PNT and Observability Industry Demand Signal",
    org: "NASA Space Communications and Navigation (SCaN) Program",
    date: "August 28, 2026",
    url: "https://www.nasa.gov/wp-content/uploads/2026/08/scan-cislunar-industry-demand-signal.pdf",
    author: "Benjamin Ashman, Ph.D., Deputy Program Manager, SCaN Mission and Stakeholder Engagement"
  },

  phases: [
    {
      n: 1, name: "Build, Test, Learn", years: "Now to 2028",
      /* Section III, Communications, and Table 1 */
      story: "Missions talk straight to Earth. Relays are still coming online, so Direct-with-Earth links carry the load and ground stations on Earth do the heavy lifting.",
      region: { alt: 125, sites: 1, sitesLabel: "1", assets: "Up to 3" },
      comms: {
        relayAvail: 50, relayAvailLabel: "50%", groundAvail: "99%",
        users: [ { year: null, noAgg: { low: 1, high: 1 }, agg: null, dwe: { low: 3, high: 3 } } ],
        relayReturn: [ { v: 50, y: "2028" } ],
        relayToEarth: [ { v: 50, y: "2028" } ],
        dwe: [ { v: 50, y: "2027" }, { v: 100, y: "2028" } ],
        forward: 25,
        small: { gb: 5, missions: "5+" },
        large: 100,
        links: "RF: S-, X- and Ka-band",
        surface: "None yet. Direct-with-Earth is the primary path until relays are operational."
      },
      pnt: {
        surface: 50, ascent: 100, orbit: 100,
        velocity: "Limited", avail: "Limited / Demonstration",
        time: "1 µs", timeNs: 1000, ttff: "600 s", ltc: "1000 ns",
        note: "Early in Phase 1 there are fewer than 4 relays, not enough to form a navigation service. These targets apply once there are."
      },
      obs: {
        ssd: 50, ssdTarget: 30, ssdLabel: "50 cm threshold, 30 cm target",
        revisitPole: "Limited", revisitBase: "3 hours",
        extra: ["Orbital and surface passive RF detection and localization", "Ionizing radiation monitoring"]
      }
    },
    {
      n: 2, name: "Establish Early Infrastructure", years: "2029 to 2032",
      story: "Surface communications stations go up at the base, offering Wi-Fi and 3GPP cellular service on the ground and an alternative path home. More users, higher throughput, fewer separate links to Earth.",
      region: { alt: 200, sites: 3, sitesLabel: "3", assets: "3 to 5" },
      comms: {
        relayAvail: 90, relayAvailLabel: "> 90%", groundAvail: "99%",
        users: [
          { year: "2030", noAgg: { low: 2, high: 6 }, agg: { low: 2, high: 4 }, dwe: { low: 3, high: 4 } },
          { year: "2032", noAgg: { low: 4, high: 10 }, agg: { low: 4, high: 6 }, dwe: { low: 4, high: 6 } }
        ],
        relayReturn: [ { v: 300, y: "2030" }, { v: 550, y: "2032" } ],
        relayToEarth: [ { v: 300, y: "2030" }, { v: 550, y: "2032" } ],
        dwe: [ { v: 200, y: null } ],
        forward: 200,
        small: { gb: 5, missions: "10+" },
        large: 650,
        links: "RF, with optical terminals possible",
        surface: "Surface stations with Wi-Fi and 3GPP proximity service."
      },
      pnt: {
        surface: 25, ascent: 50, orbit: 100,
        velocity: "0.1 m/s", avail: "80%",
        time: "0.1 µs", timeNs: 100, ttff: "600 s", ltc: "100 ns", note: null
      },
      obs: {
        ssd: 30, ssdTarget: null, ssdLabel: "30 cm or finer",
        revisitPole: "168 hours", revisitBase: "3 hours",
        extra: null /* Table 4 merges Phases 2 and 3 into one list: see obsLater */
      }
    },
    {
      n: 3, name: "Sustained Human Presence", years: "2033 and beyond",
      story: "A permanent outpost. Three to five or more surface sites, relay coverage 99% of the day, and enough bandwidth for the HD and UHD cameras NASA wants watching crews and construction.",
      region: { alt: 200, sites: 5, sitesLabel: "3 to 5+", assets: "5+" },
      comms: {
        relayAvail: 99, relayAvailLabel: "99%", groundAvail: "99%",
        users: [ { year: null, noAgg: { low: 4, high: 20 }, agg: { low: 4, high: 10 }, dwe: { low: 4, high: 9 } } ],
        relayReturn: [ { v: 850, y: "2034" }, { v: 1250, y: "Goal", plus: true } ],
        relayToEarth: [ { v: 850, y: "2034" }, { v: 1250, y: "Goal", plus: true } ],
        dwe: [ { v: 300, y: null } ],
        forward: 300,
        small: { gb: 5, missions: "10+" },
        large: 3100,
        links: "RF, with optical terminals possible",
        surface: "Surface stations with Wi-Fi and 3GPP proximity service."
      },
      pnt: {
        surface: 10, ascent: 50, orbit: 100,
        velocity: "0.1 m/s", avail: "99%",
        time: "0.1 µs", timeNs: 100, ttff: "600 s", ltc: "100 ns", note: null
      },
      obs: {
        ssd: 25, ssdTarget: null, ssdLabel: "25 cm or finer",
        revisitPole: "48 hours", revisitBase: "1.5 hours",
        extra: null
      }
    }
  ],

  /* Table 4, "Additional Capability Needs", Phase 2 and Phase 3 share one cell. */
  obsLater: [
    "Space situational awareness (electro-optical and active RF sensors)",
    "Surface and subsurface geotechnical characterization (radar sounding, microwave radiometry, synthetic aperture radar)",
    "Thermal environment characterization (thermal infrared imaging, infrared radiometer)",
    "Volatile characterization (microwave radiometry, radar sounding, infrared and ultraviolet spectroscopy, mass spectroscopy)",
    "Mineralogical characterization (ultraviolet to thermal infrared image spectroscopy, active reflectance spectroscopy)",
    "Permanently shadowed and lunar night imaging"
  ],

  /* Table 1 */
  region: { latFrom: -84, latTo: -90 },

  /* Section IV, Conclusions: the gaps industry is invited to close. */
  asks: [
    { k: "Ground stations on Earth", d: "More of them, with more throughput, and more precise navigation and timing services." },
    { k: "Relay satellites", d: "More communications and navigation relays in lunar orbit, for availability, throughput and simultaneous user links." },
    { k: "User radios", d: "Widely available, space-rated RF transceivers and optical terminals." },
    { k: "Navigation receivers", d: "Systems that acquire and track the Augmented Forward Signal, fuse sensors, and estimate position, velocity and time." },
    { k: "Surface nodes", d: "Durable Wi-Fi, 3GPP and navigation transceivers, data aggregation, links home, and atomic clocks to help establish Coordinated Lunar Time." },
    { k: "Eyes in orbit", d: "Lunar surface observation instruments and the spacecraft buses to fly them." }
  ]
};

/* Comparisons for a lay reader. NOT from the paper; labeled as mine on the page. */
window.SCALE = {
  fiberMbps: 1000,          /* a gigabit home fiber plan */
  lightPerMicrosecond: 300, /* metres light travels in 1 µs (c ≈ 3×10^8 m/s) */
  poolM: [50, 25]           /* an Olympic pool, metres */
};
