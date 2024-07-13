import { Button } from "@/components/ui/button";
import { t, Trans } from "@lingui/macro";
import { withLinguiPage } from "@/withLingui";
import { LangSwitcher } from "@/components/LangSwitcher";

export default withLinguiPage(function Home() {
  return (
    <div>
      <LangSwitcher />
      <Button>
        <Trans>Click me</Trans>
      </Button>
    </div>
  );
});
