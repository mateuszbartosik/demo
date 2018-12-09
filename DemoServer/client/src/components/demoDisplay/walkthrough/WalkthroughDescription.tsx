import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store/state";
import { getCurrentWalkthrough, getCurrentWalkthroughIndex} from "../../../store/state/DemoState";
import { Markdown } from "../../helpers/Markdown";
import { DemoLinkDto } from "../../../models/dtos";
import { IconRight, IconCancel } from "../../helpers/icons";
import { getUrlWithoutWalkthrough, geWalkthroughUrls} from "../../../store/helpers/walkthroughUrls";

interface DemoLinkDisplayProps {
    url: string;
    title: string;
}

function DemoLinkDisplay(props: DemoLinkDisplayProps) {
    const { url, title } = props;
    const fullUrl = `demos/${url}`;
    return <>
        See step explanation in <a href={fullUrl}>{title}</a>
    </>;
}

interface Props {
    descriptionHtml: string;
    title: string;
    slug: string;
    demoLink: DemoLinkDto;
    nextStepUrl: string;
    numberOfSteps: number;
    closeUrl: string;
}

function WalkthroughDescriptionComponent(props: Props) {
    const { descriptionHtml, title, slug, demoLink, nextStepUrl, numberOfSteps, closeUrl } = props;

    const stepNumber = slug && slug.split("-")[1];

    return <div className="walkthrough-step">
        <header>
            <h2> Step {stepNumber} : {title}</h2>
        </header>
        <div className="description">
            {
                demoLink
                    ? <DemoLinkDisplay {...demoLink} />
                    : <Markdown>{descriptionHtml}</Markdown>
            }
        </div>
        <footer>
            {
                stepNumber === numberOfSteps.toString()
                    ? <a href={closeUrl} className="nextStep"> Close <IconCancel /></a>
                    : <a href={nextStepUrl} className="nextStep"> Next Step <IconRight/></a>
            }
        </footer>
    </div>;
}

export const WalkthroughDescription = connect<Props>(
    ({ demos }: AppState): Props => {

        const wt = getCurrentWalkthrough(demos);
        const currentWtIndex = getCurrentWalkthroughIndex(demos);
        
        const wtUrls = geWalkthroughUrls(demos);
        const nextStepUrl = wtUrls[currentWtIndex+1];
        const numberOfSteps = wtUrls.length;
        const closeUrl = getUrlWithoutWalkthrough(demos);

        if (!wt) {
            return {
                descriptionHtml: null,
                title: null,
                slug: null,
                demoLink: null,
                nextStepUrl: null,
                numberOfSteps: 0,
                closeUrl: null
            }
        }
        const { descriptionHtml, title, slug, demoLink } = wt;

        return {
            descriptionHtml,
            title,
            slug,
            demoLink,
            nextStepUrl,
            numberOfSteps,
            closeUrl
        }
    }
)(WalkthroughDescriptionComponent);
