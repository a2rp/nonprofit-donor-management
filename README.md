![Kindred donor management overview](./screenshot.png)

# Kindred - Nonprofit Donor Management

Kindred is a frontend-only donor relationship workspace for small nonprofit teams. It brings donor records, campaign progress, gift history, and stewardship follow-ups into one responsive interface.

**Live app:** [https://a2rp.github.io/nonprofit-donor-management/](https://a2rp.github.io/nonprofit-donor-management/)

## Pages

- `/` - Impact overview with session totals, active campaigns, recent gifts, and gifts needing acknowledgement.
- `/donors` - Donor directory with search and segment filters.
- `/donors/:id` - Donor profile, contact links, giving history, and relationship touchpoints. For example, `/donors/D-2048`.
- `/campaigns` - Active and archived campaigns with fundraising progress.
- `/gifts` - Giving ledger with search and campaign and acknowledgement filters.
- Any unknown path - A branded not-found page with links back into the app.

## What works

- Add, edit, search, filter, sort, and remove donor records. Donor removal uses a custom confirmation dialog.
- Open a donor profile to review linked gifts, update profile information, and add or edit relationship touchpoints.
- Create and edit campaigns, switch between active and archived campaigns, archive or restore them, and remove them with confirmation.
- Campaign totals and progress update from the gifts linked to each campaign. Removing a campaign keeps gift records and clears their campaign assignment.
- Record gifts for a named donor or anonymously, edit gift details, filter and search the ledger, prepare an acknowledgement status, and remove gifts with confirmation.
- See derived totals and follow-up counts on the overview. Changes made in one route are reflected in the other pages during the same session.
- Forms validate required values and show in-app feedback. Destructive actions use custom dialogs, and successful actions show toast notifications.
- Layouts adapt to mobile screens. Route changes return to the top of the page.

The app uses seeded sample records held in React state in the browser. It has no backend and does not send email, process donations, or save changes to browser storage. Refreshing or reopening the app resets changes to the sample data. Preparing an acknowledgement changes its demo status only; it does not send a message.

## Screenshots

Screenshots below show the local production build at desktop or mobile viewport sizes. Dialog screenshots show the actual interface with representative sample data.

### Pages

| Page | Preview |
| --- | --- |
| Impact overview, desktop | ![Kindred impact overview with campaign progress, stewardship queue, and giving totals](./screenshots/pages/impact-overview.png) |
| Donor directory | ![Donor directory with search, segment filters, and donor records](./screenshots/pages/donor-book.png) |
| Donor profile | ![Donor profile with giving history and relationship details](./screenshots/pages/donor-profile.png) |
| Campaign board | ![Campaign board with fundraising progress and active campaigns](./screenshots/pages/campaign-board.png) |
| Giving ledger | ![Giving ledger with gift records and follow-up status](./screenshots/pages/giving-ledger.png) |
| Not-found page | ![Branded not-found page with links back to the app](./screenshots/pages/not-found.png) |
| Impact overview, mobile navigation open | ![Mobile overview with the responsive navigation menu expanded](./screenshots/pages/impact-overview-mobile.png) |

### Dialogs

| Dialog | Preview |
| --- | --- |
| Add donor | ![Add donor form](./screenshots/modals/donor-add.png) |
| Edit donor | ![Edit donor form](./screenshots/modals/donor-edit.png) |
| Confirm donor removal | ![Custom donor removal confirmation](./screenshots/modals/donor-remove-confirm.png) |
| Edit donor profile | ![Edit donor profile form](./screenshots/modals/donor-profile-edit.png) |
| Confirm profile removal | ![Custom donor profile removal confirmation](./screenshots/modals/donor-profile-remove-confirm.png) |
| Add relationship touchpoint | ![Add touchpoint form on a donor profile](./screenshots/modals/touchpoint-add.png) |
| Create campaign | ![Create campaign form](./screenshots/modals/campaign-add.png) |
| Edit campaign | ![Edit campaign form](./screenshots/modals/campaign-edit.png) |
| Confirm campaign archive | ![Custom campaign archive confirmation](./screenshots/modals/campaign-archive-confirm.png) |
| Confirm campaign restore | ![Custom campaign restore confirmation](./screenshots/modals/campaign-restore-confirm.png) |
| Confirm campaign removal | ![Custom campaign removal confirmation](./screenshots/modals/campaign-remove-confirm.png) |
| Record a gift | ![Record gift form](./screenshots/modals/gift-add.png) |
| Edit a gift | ![Edit gift form](./screenshots/modals/gift-edit.png) |
| Confirm gift removal | ![Custom gift removal confirmation](./screenshots/modals/gift-remove-confirm.png) |

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

The development server prints the local URL when it starts.

## Checks and deployment

```bash
npm run lint
npm run build
npm run deploy
```

The deploy script builds the app, creates the GitHub Pages fallback page, and publishes the `dist` directory to the `gh-pages` branch. GitHub Pages should be configured to publish from the `gh-pages` branch and its root directory.

**Deployed app:** [https://a2rp.github.io/nonprofit-donor-management/](https://a2rp.github.io/nonprofit-donor-management/)

## Image attribution

The food bank volunteer photo is a local copy of [Joel Muniz's photo on Unsplash](https://unsplash.com/photos/people-packing-food-in-plastic-bags-qvzjG2pF4bE). It is used in the context of the community food program.

## Future improvements

These backend-dependent extensions are not implemented in this frontend preview:

- Shared server-side donor, campaign, and gift records with team accounts, access permissions, and audit history.
- A connected email or SMS provider for sending and tracking donor acknowledgements.
- Donation processor and accounting integrations for importing transactions and reconciling gifts.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
