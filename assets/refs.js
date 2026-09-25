/* The references behind the SCaN paper, read and checked against each source's
   own text. Every entry names its source tag and page so it can be traced.
   Tags: T/§ SCaN demand signal · UG Moon Base User's Guide · SRD Lunar Relay
   Services Requirements · LN LunaNet Interoperability Spec v5 · AFS Augmented
   Forward Signal standard · ADD Moon to Mars Architecture Definition Doc Rev C
   · FS Ignition "Building the Moon Base" fact sheet · WEB nasa.gov pages. */
/* When every source link and quoted figure was last re-checked. */
window.CHECKED = "September 24, 2026";

window.SOURCES = [
  { tag: "T", title: "Lunar Communications, PNT and Observability Industry Demand Signal", org: "NASA SCaN", date: "August 28, 2026",
    url: "https://www.nasa.gov/wp-content/uploads/2026/08/scan-cislunar-industry-demand-signal.pdf",
    note: "The main source. Tables 1 to 4 drive every phase number on the home page." },
  { tag: "UG", title: "Moon Base User's Guide: Architecture Resources", org: "NASA", date: "April 2026",
    url: "https://www.nasa.gov/wp-content/uploads/2026/04/moon-base-architecture-users-guide.pdf",
    note: "Traffic per phase, phase goals, Phase 1 targets by system. Reference 1 in the SCaN paper." },
  { tag: "LN", title: "LunaNet Interoperability Specification, Version 5 (Baseline)", org: "NASA, ESA, JAXA", date: "January 29, 2025",
    url: "https://www.nasa.gov/wp-content/uploads/2025/02/lunanet-interoperability-specification-v5-baseline.pdf",
    note: "How many providers become one network: services, protocols, radio bands. Reference 5." },
  { tag: "AFS", title: "LunaNet Signal-In-Space Recommended Standard: Augmented Forward Signal, Vol. A, v1", org: "NASA, ESA, JAXA", date: "January 29, 2025",
    url: "https://www.nasa.gov/wp-content/uploads/2025/02/lunanet-signal-in-space-recommended-standard-augmented-forward-signal-vol-a.pdf",
    note: "The navigation signal itself. A recommended standard, with many values still to be confirmed. Reference 6." },
  { tag: "SRD", title: "Lunar Relay Services Requirements Document (ESC-LCRNS-REQ-0090) Rev B", org: "NASA Goddard, LCRNS project", date: "Baselined Dec 2022, last change Mar 2023, posted Aug 2025",
    url: "https://www.nasa.gov/wp-content/uploads/2025/08/lunar-relay-services-requirements-document-srd.pdf",
    note: "What commercial relays must provide. Older than the SCaN paper, and many values are marked to be reviewed. Reference 7." },
  { tag: "ADD", title: "Moon to Mars Architecture Definition Document, Revision C", org: "NASA", date: "December 2025",
    url: "https://www.nasa.gov/wp-content/uploads/2025/12/add-revision-c-20251211.pdf",
    note: "The whole architecture. Used here only for communications, navigation, timing and imaging. Reference 8." },
  { tag: "FS", title: "Building the Moon Base (Ignition fact sheet)", org: "NASA", date: "March 2026",
    url: "https://www.nasa.gov/wp-content/uploads/2026/03/building-the-moon-base-1.pdf",
    note: "Linked from nasa.gov/ignition, which the User's Guide names as home of current phasing details." },
  { tag: "WEB", title: "NASA web pages: Moon Base, Moon Base phases, Moon Base systems, Artemis", org: "NASA", date: "Read September 22, 2026 (phases page updated August 24, 2026)",
    url: "https://www.nasa.gov/moonbase-phases/",
    note: "Current schedule and relay plans. References 2 and 3, plus the pages they lead to." }
];

/* References we could not use, and why. */
window.UNREAD = [
  { title: "SFCG Recommendation 32-2R6, frequencies for the lunar region",
    why: "The link in the SCaN paper now returns “page not found”. The band map on the Standards page uses the LunaNet specification instead, whose band notes cite the previous revision, SFCG 32-2R5." }
];

/* Where the sources disagree. The site shows both sides and picks neither. */
window.CONFLICTS = [
  { k: "Phase dates",
    a: "SCaN (Aug 28, 2026): Now to 2028, 2029 to 2032, 2033 and beyond.",
    b: "NASA's phases page (updated Aug 24, 2026) and the March fact sheet: Now to 2029, 2029 to 2032, 2032 and beyond.",
    site: "The home page follows SCaN, because its tables are built on those dates." },
  { k: "Phase names",
    a: "SCaN: Build, Test, Learn; Establish Early Infrastructure; Sustained Human Presence.",
    b: "Phases page: Gain Reliable Access, Experiment, and Learn; Build and Expand; Live and Work on the Moon. Fact sheet: Experiment, Learn; Early Habitation; Sustained Human Presence.",
    site: "SCaN's names, for consistency with its tables." },
  { k: "Where the first service zone starts",
    a: "SCaN Table 1: latitude -84° to -90°.",
    b: "SRD and ADD: the first relay service volume runs from 80° S (to 125 km), widening to 75° S (to 200 km).",
    site: "The globe draws SCaN's -84°. The older, wider volumes are listed on the Standards page." },
  { k: "Phase 3 cargo",
    a: "User's Guide: about 150,000 kg for the phase.",
    b: "Fact sheet: “up to 38 tons of cargo per year.”",
    site: "Both shown. One is a phase total, the other a yearly rate." },
  { k: "Phase 1 throughput",
    a: "SCaN Table 2: relay return of 50 Mbps in 2028 (a demand forecast).",
    b: "User's Guide: a second relay constellation and surface ground stations “to enable > 500Mbps” (a capability target). SRD: 50 Mbps Ka-band return for a crewed lander.",
    site: "Shown side by side on the home page, not reconciled." },
  { k: "The name of lunar time",
    a: "SCaN: Coordinated Lunar Time (LTC), traced to UTC.",
    b: "LunaNet and the AFS standard: LunaNet Reference Time (LRT). ADD: “a coordinated lunar time scale”, still an unallocated function (FN-C-205).",
    site: "All three names given where they come up. No source says how they relate." },
  { k: "Wi-Fi and cellular on the surface",
    a: "SCaN: Wi-Fi and 3GPP surface stations from Phase 2.",
    b: "LunaNet v5: IP over Wi-Fi and 3GPP are not part of LunaNet 1.0; cellular is “under investigation”.",
    site: "Not a contradiction in time, but worth knowing: the standard for it is not written yet." },
  { k: "Which Artemis lands first",
    a: "Artemis III is widely remembered as the planned first landing (general knowledge, not from these sources).",
    b: "NASA's Artemis page: Artemis III is now a 2027 demonstration in low Earth orbit; Artemis IV targets the first landing in 2028.",
    site: "Follows the current Artemis page." },
  { k: "Ka-band or K-band",
    a: "SCaN, SRD and ADD say Ka-band.",
    b: "LunaNet v5 calls the same 22 to 27.5 GHz links K-band.",
    site: "Same radio links, two names." }
];

/* Opinion, not NASA's: Swapnil's notes as a security engineer. Each links to
   the requirement it reacts to. Approved for publication 2026-09-22. */
window.NOTES = [
  { t: "The relay is not trusted with your data",
    d: "The requirements say relays pass user data along without ever decrypting it. That is the same bargain payment networks make: the pipes in the middle route what they cannot read. Treat the transport as untrusted and you stop worrying about who owns each hop.",
    src: "SRD 27" },
  { t: "Authentication from day one",
    d: "The Moon's navigation signal copies GPS on purpose. Civil GPS was never authenticated, and Earth is still dealing with spoofing because of it. Here the navigation service must authenticate itself and resist jamming from the start. That is the right lesson to have learned.",
    src: "SRD 45, AFS 47" },
  { t: "Custody is a promise",
    d: "Store-and-forward with custody transfer means each hop takes responsibility for a bundle before the previous one lets go. Financial messaging has worked this way for decades, because a lost payment instruction is not an option. A lost command near the Moon is not one either.",
    src: "SRD 38, LN 18" },
  { t: "Autonomy raises the stakes",
    d: "The network must also connect users near the Moon without routing through Earth. As more systems act without a human in the loop, the time and position they act on become the thing to protect. It is the same problem I see with AI agents: the risk is in the inputs they trust.",
    src: "SRD 27" }
];

/* Standards page content. */
window.STD = {
  lunanet: [
    { t: "A network of networks", d: "LunaNet is “a network of cooperating networks (network of networks, akin to the terrestrial Internet)”. No single operator runs it.", src: "LN 9" },
    { t: "Many providers, one experience", d: "Government and commercial providers each run a piece. A user should get the same service from any of them, so that it “appears as a single provider”.", src: "LN 15" },
    { t: "International from the start", d: "The first version, LunaNet 1.0, includes providers from NASA, ESA and Japan. NASA is coordinating its relay purchase with a similar ESA activity called Moonlight.", src: "LN 9, ADD 86" },
    { t: "Four kinds of service", d: "Communications, Position, Navigation and Timing, Messaging, and Detection and Information (such as alerts).", src: "LN §3" }
  ],
  send: [
    { t: "Real time", d: "Like a phone call: data flows while a link is up. Built on IP (IPv4 or IPv6) or the Bundle Protocol.", src: "LN 18, 21, 47" },
    { t: "Store and forward", d: "Like a post office: relays hold data until the next hop is available, which “explicitly deals with long delays, disruption, and/or disconnection”. It uses Delay/Disruption Tolerant Networking (DTN), Bundle Protocol version 7, and relays must keep custody of each bundle.", src: "LN 18, 21, SRD 38" },
    { t: "How long it takes", d: "The requirements estimate about 5 seconds end to end, from a user on Earth to a user on the lunar surface. Each relay node gets under 1 second (to be reviewed).", src: "SRD 27" },
    { t: "Staying on the Moon", d: "Relays must also connect users near the Moon to each other without routing through Earth, which would add delay and use Earth stations.", src: "SRD 27" }
  ],
  gps: [
    ["", "The Moon's navigation signal", "GPS L1 C/A, for comparison"],
    ["Carrier", "2492.028 MHz, S-band (2483.5 to 2500 MHz)", "1575.42 MHz"],
    ["Data component", "Code “similar to the GPS C/A code”, 1.023 million chips per second, 500 symbols per second", "1.023 million chips per second"],
    ["Pilot component", "No data, 5.115 million chips per second, built like the GPS L1C pilot code", "L1C is a newer GPS signal"],
    ["Message frame", "12 seconds, carrying clock and orbit data, time and health", "Navigation message (different structure)"],
    ["Time scale", "LunaNet Reference Time (LRT)", "GPS Time"],
    ["Error per transmitter", "40 m or less, 95% of the time (to be confirmed)", "(not compared here)"]
  ],
  gpsNote: "Lunar values from the AFS standard, pages 13 to 51. GPS values are general reference, not from these documents.",
  bands: [
    /* [label, group, lowMHz, highMHz, source] */
    ["S-band, to users", "Near the Moon", 2025, 2110, "LN 45"],
    ["S-band, from users", "Near the Moon", 2200, 2290, "LN 41"],
    ["Navigation signal", "Navigation", 2483.5, 2500, "LN 24, AFS 14"],
    ["X-band, Earth up", "To and from Earth", 7190, 7235, "LN 39"],
    ["X-band, Earth down", "To and from Earth", 8450, 8500, "LN 39, 44"],
    ["K-band, Earth up", "To and from Earth", 22550, 23150, "LN 45"],
    ["K-band, to users", "Near the Moon", 23150, 23550, "LN 42"],
    ["K-band, Earth down", "To and from Earth", 25500, 27000, "LN 45"],
    ["K-band, from users", "Near the Moon", 27000, 27500, "LN 42"]
  ],
  bandNotes: [
    { t: "S-band stays local", d: "LunaNet keeps S-band for links near the Moon and uses X-band for links to Earth.", src: "LN 39" },
    { t: "An emergency whisper", d: "A contingency mode drops to 15.625 symbols per second, for when power is short or the antenna cannot point properly.", src: "LN 45" },
    { t: "Not yet written", d: "Standards for optical links are still to be determined, and Wi-Fi and cellular are not part of LunaNet 1.0.", src: "LN 21, 37" },
    { t: "On the ground", d: "Surface radios move from legacy UHF and Wi-Fi toward terrestrial 3GPP/5G standards.", src: "ADD 67" }
  ],
  relays: [
    { when: "2025 to 2028", t: "Initial capability", d: "“A few relays in lunar orbit”, proven in three increments: Alpha, Bravo and Charlie. Service from 80° S to the pole, up to 125 km.", src: "SRD 10, 13, ADD 66" },
    { when: "Next", t: "Wider zone", d: "The service volume grows to 75° S and 200 km, with simultaneous S-band and Ka-band links.", src: "SRD 13, ADD 66" },
    { when: "2030 (to be reviewed)", t: "Enhanced capability", d: "A larger network with global coverage of the Moon.", src: "SRD 10, 14" },
    { when: "Phase 1, per NASA today", t: "Five satellites, then a second provider", d: "“An initial five-satellite orbital relay constellation”, followed by a second provider's constellation for coverage and resiliency. The first satellite is Altus-1, from Intuitive Machines.", src: "WEB" }
  ],
  relayNote: "The requirements define coverage, service volumes and links, not orbits. That is why the orbits on the home page globe are schematic.",
  security: [
    { t: "Commands are encrypted", d: "Every relay node must use FIPS 140-3 certified encryption for all spacecraft commands.", src: "SRD 45" },
    { t: "Relays cannot read your data", d: "User data stays encrypted end to end: “no decryption of user data through the relay path”.", src: "SRD 27" },
    { t: "Navigation you can trust", d: "The navigation service must be able to authenticate itself against spoofing, and resist jamming.", src: "SRD 45" },
    { t: "Ground systems too", d: "Each provider's ground system must be assessed and authorized as an information system.", src: "SRD 45" }
  ],
  sar: [
    { t: "Search and rescue", d: "In the enhanced phase, an emergency beacon at the South Pole should be detected within 5 minutes and located to within 50 metres, without relying on the beacon's own reported position. Both values are to be reviewed.", src: "SRD 43–44" }
  ]
};
