import { DAILY_FREE_PLAYS } from "@/lib/playLimit";
import EnglishArticle from "@/components/EnglishArticle";
import Link from "next/link";
export const metadata = {"title": "Terms of use | Mahjong Tsujigiri!", "description": "Last updated: September 16, 2026"};
const sections = [
  {
    "title": "Agreement",
    "paragraphs": [
      "These terms govern use of Mahjong Tsujigiri! (the “App”), provided by OrangeZely (the “Developer”). By using the App, you agree to these terms."
    ]
  },
  {
    "title": "1. Service",
    "paragraphs": [
      "The App is a free-to-start mahjong practice game in which you answer discard and fu questions and compete for scores. No account registration is required."
    ]
  },
  {
    "title": "2. Prohibited conduct",
    "bullets": [
      "Submitting scores using automated play, altered data, or other dishonest methods.",
      "Using offensive or inappropriate player names.",
      "Interfering with operation of the App.",
      "Copying, republishing, or selling App content without permission.",
      "Other conduct the Developer considers inappropriate."
    ]
  },
  {
    "title": "3. Leaderboard",
    "paragraphs": [
      "Submitted player names and scores are public to App users. The Developer may remove entries that violate these terms without prior notice."
    ]
  },
  {
    "title": "4. Intellectual property",
    "paragraphs": [
      "Rights to the App’s problem data, design, software, and other content belong to the Developer or their respective rights holders."
    ]
  },
  {
    "title": "5. Availability and disclaimer",
    "paragraphs": [
      "The App is provided as is, without a guarantee of completeness, accuracy, or usefulness. The Developer is not responsible for loss arising from use of the App to the extent permitted by applicable law. The App may be changed, suspended, or discontinued without prior notice. Network or device conditions may prevent normal operation."
    ]
  },
  {
    "title": "6. Advertising",
    "paragraphs": [
      "Third-party advertisements may appear in the App. See the Privacy policy for information about advertising data and privacy choices."
    ]
  },
  {
    "title": "7. Paid plans",
    "paragraphs": [
      "Premium is available as a monthly or annual auto-renewing subscription, providing unlimited plays, no ads, and new problems added monthly. Remove Ads is a separate one-time purchase that removes ads; it does not provide unlimited plays.",
      "Prices and currency vary by region. The applicable price is shown in the App and confirmed in the App Store or Google Play purchase sheet. Purchases are available in the native app.",
      "Subscriptions renew automatically unless canceled before renewal. For App Store subscriptions, cancel at least 24 hours before the current period ends; your Apple account is charged for renewal within the final 24 hours. For Google Play subscriptions, renewal and cancellation follow the terms shown by Google Play.",
      "If a free trial is offered, it converts to a paid subscription unless canceled before the trial ends. On the App Store, any unused portion of a free trial is forfeited when you purchase a subscription.",
      "Cancel in iOS Settings → your name → Subscriptions, or Google Play → Payments & subscriptions. Access continues through the paid period. Refund requests are handled under the applicable store policy and law.",
      "After reinstalling or changing devices, use Restore purchases with the store account used for the purchase."
    ]
  },
  {
    "title": "8. Changes to these terms",
    "paragraphs": [
      "These terms may be revised when necessary. Significant changes will be announced on this page. Continued use after a change means acceptance of the updated terms."
    ]
  },
  {
    "title": "9. Governing law",
    "paragraphs": [
      "These terms are governed by and interpreted under Japanese law, subject to mandatory protections under applicable law."
    ]
  },
  {
    "title": "10. Contact",
    "paragraphs": [
      "mahjong.tsujigiri@gmail.com"
    ]
  }
];
export default function Page() { return <EnglishArticle title="Terms of use" intro="Last updated: September 16, 2026" sections={sections} practice="/en/"><p className="mt-6">The free plan includes {DAILY_FREE_PLAYS} plays per day, resetting at midnight in your device’s local time.</p><p className="mt-4"><Link className="text-yellow-300 underline" href="/en/privacy/">Privacy policy</Link> · <a className="text-yellow-300 underline" href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Apple standard EULA</a></p></EnglishArticle>; }
