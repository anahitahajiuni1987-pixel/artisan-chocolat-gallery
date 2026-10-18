<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Store architecture
- Keep cart normalization and quantity operations in a browser-safe pure module shared by the provider and tests, so persisted cart data cannot bypass pricing validation.
- Keep checkout validation in a browser-safe module alongside the existing server validation, so Iranian forms can be tested without database access.
- Keep gateway contracts in server-only modules and leave checkout disabled until a real adapter and server verification are tested, so secrets and payment authority never belong to the browser.
- Use the existing photo for mobile, reduced-motion, loading and unsupported 3D states, and pause the scene offscreen, so the retained hero does not block shopping on constrained devices.
