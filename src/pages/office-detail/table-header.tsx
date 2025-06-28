import { useTranslation } from "react-i18next"

export default function OfficeDetailTableHeader() {
    const { t } = useTranslation()

    return (
        <div className="grid grid-cols-6 gap-3 w-full text-start text-primary ">
            <p className="font-semibold  text-sm ">{t("Lavozim")}</p>
            <p className="font-semibold  text-sm">{t("Vaqtida kelganlar")}</p>
            <p className="font-semibold  text-sm">{t("Kech qolganlar")}</p>
            <p className="font-semibold  text-sm">
                {t("Kelmaganlar / Sababli")}
            </p>
            <p className="font-semibold  text-sm">
                {t("Kelmaganlar / Sababsiz")}
            </p>
            <p className="font-semibold  text-sm">{t("Jami ishchilar")}</p>
        </div>
    )
}
