import { generateMetadata } from "@/libs/seo";

export const authors = [
  {
    slug: "voltahome-team",
    name: "VoltaHome Team",
    job: "Home Safety Experts",
    description: "Experts in home battery management and safety device maintenance.",
    avatar: "/blog/authors/voltahome-team.jpg",
    socials: [
      {
        name: "Twitter",
        icon: "TwitterIcon",
        url: "https://twitter.com/voltahome",
      },
    ],
  },
];

// Categories for your blog
export const categories = [
  {
    slug: "smoke-detectors",
    title: "Smoke Detectors",
    titleShort: "Smoke Detectors",
    description: "Safety guides for smoke detector battery maintenance",
    descriptionShort: "Smoke detector safety guides",
  },
  {
    slug: "home-batteries",
    title: "Home Batteries", 
    titleShort: "Home Batteries",
    description: "Everything about household battery types and replacement",
    descriptionShort: "Home battery guides",
  },
  {
    slug: "safety-devices",
    title: "Safety Devices",
    titleShort: "Safety Devices", 
    description: "Maintain carbon monoxide detectors and other safety equipment",
    descriptionShort: "Safety device maintenance",
  },
  {
    slug: "tracking-tips",
    title: "Battery Tracking",
    titleShort: "Tracking Tips",
    description: "Tips and tricks for organizing your battery replacement schedule", 
    descriptionShort: "Organization tips",
  },
];

// Your articles array
export const articles = [
  {
    slug: "when-to-change-smoke-detector-batteries",
    title: "When to Change Smoke Detector Batteries: Complete Safety Guide",
    description: "Learn exactly when and how to change smoke detector batteries. Includes testing schedule, battery types, and safety tips to keep your family protected.",
    categories: [
      categories.find((category) => category.slug === "smoke-detectors"),
      categories.find((category) => category.slug === "safety-devices"),
    ],
    author: {
      name: "VoltaHome Team",
      job: "Home Safety Experts",
      avatar: "/blog/authors/voltahome-team.jpg", // You can add this later
    },
    publishedAt: "2025-07-15", // Today's date
    image: {
      src: "/blog/when-to-change-smoke-detector-batteries/hero.jpg", // You'll add this
      alt: "Smoke detector with battery compartment open showing battery replacement",
    },
    content: <>
      <section>
        <p className="text-lg leading-relaxed mb-6">
          Every year, 2,000+ house fires occur because of dead smoke detector batteries. 
          Don&apos;t let your family become a statistic. This complete guide shows you exactly 
          when and how to change your smoke detector batteries to keep your home safe.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">How Often Should You Change Smoke Detector Batteries?</h2>
        <p className="mb-4">
          <strong>The golden rule:</strong> Change smoke detector batteries at least once per year, 
          even if they seem to be working. Most experts recommend changing them when daylight 
          saving time begins or ends - it&apos;s an easy way to remember.
        </p>
        
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
          <h3 className="font-bold text-red-800">⚠️ Critical Safety Warning</h3>
          <p className="text-red-700">
            Never ignore a chirping smoke detector. That beep means the battery is critically 
            low and needs immediate replacement. A smoke detector without power cannot save your life.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Signs Your Smoke Detector Battery Needs Replacing</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>Chirping sound:</strong> The most obvious sign - usually happens at night when temperatures drop</li>
          <li className="mb-2"><strong>Low battery warning:</strong> Some detectors have a voice alert</li>
          <li className="mb-2"><strong>Test button fails:</strong> If pressing the test button produces a weak or no sound</li>
          <li className="mb-2"><strong>Age:</strong> If you can&apos;t remember when you last changed it, it&apos;s time</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Step-by-Step Battery Replacement Guide</h2>
        <ol className="list-decimal pl-6 mb-6">
          <li className="mb-3"><strong>Turn off power</strong> (for hardwired detectors) at the circuit breaker</li>
          <li className="mb-3"><strong>Remove the detector</strong> by twisting counterclockwise or pressing the release tab</li>
          <li className="mb-3"><strong>Open the battery compartment</strong> - usually a sliding door or hinged cover</li>
          <li className="mb-3"><strong>Remove the old battery</strong> and note the type (usually 9V)</li>
          <li className="mb-3"><strong>Insert the new battery</strong> matching the + and - terminals correctly</li>
          <li className="mb-3"><strong>Reinstall the detector</strong> and restore power</li>
          <li className="mb-3"><strong>Test the detector</strong> by pressing the test button for 3-5 seconds</li>
        </ol>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
          <h3 className="font-bold text-blue-800">💡 Pro Tip</h3>
          <p className="text-blue-700">
            Use VoltaHome to take a photo of each smoke detector and track when you last 
            changed the battery. Set reminders so you never forget this critical safety task.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Best Battery Types for Smoke Detectors</h2>
        <p className="mb-4">
          <strong>9V Alkaline:</strong> Most common and reliable. Lasts 12-18 months in most detectors.
        </p>
        <p className="mb-4">  
          <strong>9V Lithium:</strong> More expensive but lasts 2-3 years. Worth it for hard-to-reach detectors.
        </p>
        <p className="mb-6">
          <strong>Avoid:</strong> Rechargeable batteries - they don&apos;t provide consistent power as they discharge.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Never Forget Again</h2>
        <p className="mb-4">
          The easiest way to stay on top of smoke detector maintenance is with a tracking system. 
          VoltaHome lets you photograph each detector, record when you changed the battery, 
          and get automatic reminders when it&apos;s time for replacement.
        </p>
        
        <div className="text-center my-8">
          <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
            Start Tracking Your Smoke Detectors →
          </a>
        </div>
      </section>
    </>,
  },
  // You can add more articles here later
];