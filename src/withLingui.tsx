import React, { ReactNode } from "react";
import { setI18n } from "@lingui/react/server";
import { getAllI18nInstances } from "./appRouterI18n";

export type PageLangParam = {
  params: { lang: string };
};

type PageProps = PageLangParam & {
  searchParams?: any; // in query
};

type LayoutProps = PageLangParam & {
  children: React.ReactNode;
};

type PageExposedToNextJS<Props extends PageProps> = (props: Props) => ReactNode;

export const withLinguiPage = <Props extends PageProps>(
  AppRouterPage: React.ComponentType<PageLangParam & Props>
): PageExposedToNextJS<Props> => {
  return async function WithLingui(props) {
    const lang = props.params.lang;
    const allI18nInstances = await getAllI18nInstances();
    const i18n = allI18nInstances[lang]!;
    setI18n(i18n);

    return <AppRouterPage {...props} lang={lang} />;
  };
};

type LayoutExposedToNextJS<Props extends LayoutProps> = (
  props: Props
) => ReactNode;

export const withLinguiLayout = <Props extends LayoutProps>(
  AppRouterPage: React.ComponentType<PageLangParam & Props>
): LayoutExposedToNextJS<Props> => {
  return async function WithLingui(props) {
    const lang = props.params.lang;
    const allI18nInstances = await getAllI18nInstances();
    const i18n = allI18nInstances[lang]!;
    setI18n(i18n);

    return <AppRouterPage {...props} lang={lang} />;
  };
};
