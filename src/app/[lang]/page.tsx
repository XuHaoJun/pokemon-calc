import { Button } from "@/components/ui/button";
import { t, Trans } from "@lingui/macro";
import { withLinguiPage } from "@/withLingui";

export default withLinguiPage(function Home() {
  return (
    <div>
      <Button>
        <Trans>Click me</Trans>
      </Button>
    </div>
  );
});
