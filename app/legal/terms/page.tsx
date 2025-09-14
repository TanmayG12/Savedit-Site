export const metadata = { title: "Terms — SavedIt" };
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p><em>By using SavedIt, you agree to these terms.</em></p>
      <ol>
        <li>You retain rights to your content.</li>
        <li>Don't upload illegal or harmful content.</li>
        <li>Service is provided "as is," without warranties.</li>
        <li>We may update these terms; continued use means acceptance.</li>
      </ol>
      <p><small>Last updated: September 2025</small></p>
    </main>
  );
}
