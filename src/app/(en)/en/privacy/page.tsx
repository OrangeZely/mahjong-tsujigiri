import EnglishArticle from "@/components/EnglishArticle";
export const metadata = {"title": "Privacy policy | Mahjong Tsujigiri!", "description": "Last updated: September 16, 2026"};
const sections = [
  {
    "title": "About this policy",
    "paragraphs": [
      "Mahjong Tsujigiri! (the “App”) is a mahjong practice game provided by OrangeZely (the “Developer”). This policy describes how information is handled in the App."
    ]
  },
  {
    "title": "1. Information collected",
    "bullets": [
      "Player name (nickname): the name you choose when submitting a leaderboard entry. You do not need to use your real name.",
      "Game scores and results: correct answers, total answers, accuracy, score, and game mode submitted to the leaderboard.",
      "Purchase information: purchase history, subscription status, and an app user ID used to manage purchase entitlements.",
      "Device, advertising, usage, and diagnostic information: third-party services may collect device identifiers, advertising data, product interactions, other usage data, approximate location, crash data, and performance data to deliver ads, improve quality, and prevent abuse."
    ],
    "paragraphs": [
      "The App does not ask you to enter your real name, address, telephone number, email address, or precise location. In the LINE version, your LINE display name may be used to initialize your player name if you have not already chosen one."
    ]
  },
  {
    "title": "2. How information is used",
    "bullets": [
      "Providing the leaderboard and calculating rankings.",
      "Managing purchases, subscriptions, and restoration.",
      "Delivering and measuring advertising and preventing abuse.",
      "Investigating problems and improving performance and app quality."
    ]
  },
  {
    "title": "3. Information stored on your device",
    "paragraphs": [
      "Play history and your best score are stored on your device and are not uploaded as history records. You can delete them on the History screen. Your nickname, language choice, daily play count, and review-request status are also stored locally. Browser and native app storage are separate."
    ]
  },
  {
    "title": "4. Advertising and privacy choices",
    "paragraphs": [
      "The native App may use Google AdMob, provided by Google LLC. Google may collect device and advertising identifiers, usage data, approximate location, and diagnostics for advertising, measurement, and abuse prevention.",
      "Where required, Google’s User Messaging Platform presents a privacy message. When privacy options are required, use “Ad privacy choices” in the App to review or change your choices. If the App cannot establish permission to request ads, it does not request them. Advertising choices and any device tracking permission are separate."
    ]
  },
  {
    "title": "5. Third-party services",
    "bullets": [
      "Supabase: storing leaderboard data and providing practice problems.",
      "RevenueCat and Apple App Store / Google Play: managing purchases, subscriptions, and restoration.",
      "Google AdMob and UMP: advertising, measurement, abuse prevention, and advertising privacy choices.",
      "LINE LIFF, when using the LINE version: obtaining your display name as described above."
    ],
    "paragraphs": [
      "Each service handles information under its own privacy policy."
    ]
  },
  {
    "title": "6. Sharing information",
    "paragraphs": [
      "The Developer does not share collected information except for the service processing described above, with your consent, or as required by law. Names and scores submitted to the leaderboard are visible to other users."
    ]
  },
  {
    "title": "7. Deleting data",
    "paragraphs": [
      "To request deletion of a leaderboard entry, contact the address below. After confirming the registered player name, we will remove the entry promptly. Deleting local history does not remove a leaderboard entry."
    ]
  },
  {
    "title": "8. Changes",
    "paragraphs": [
      "This policy may be updated when necessary. Significant changes will be announced on this page."
    ]
  },
  {
    "title": "9. Contact",
    "paragraphs": [
      "mahjong.tsujigiri@gmail.com"
    ]
  }
];
export default function Page() { return <EnglishArticle title="Privacy policy" intro="Last updated: September 16, 2026" sections={sections} practice="/en/"><p className="mt-6"><a className="underline text-yellow-300" href="https://policies.google.com/technologies/ads?hl=en" target="_blank" rel="noopener noreferrer">Google advertising policy</a></p></EnglishArticle>; }
