import * as React from "react";
import * as classNames from "classnames";
import { DemoWithProgress } from "../../models/demo";
import { connect } from "react-redux";
import { goToDemoPage } from "../../store/actions/navigation";
import { CategorySlug } from "../../models/slugs";
import { DemoThunkDispatch } from "../../store";

interface DispatchProps {
    goToDemoPage: () => void;
}

interface OwnProps {
    category: CategorySlug;
    demo: DemoWithProgress;
}

type Props = DispatchProps & OwnProps;

function DemoItemComponent(props: Props) {
    const { category, demo, goToDemoPage } = props;

    const className = classNames("demo-item", {
        "done": demo.completed
    });

    const imageSrc = `../img/demo-icons/${category}/${demo.slug}.png`;

    return <a className={className} onClick={goToDemoPage} >
        <img src={imageSrc} />
        <div className="title">{demo.title}</div>
    </a>;
}

function mapDispatchToProps(dispatch: DemoThunkDispatch, ownProps: OwnProps): DispatchProps {
    const { demo, category } = ownProps;

    return {
        goToDemoPage: () => dispatch(goToDemoPage(category, demo.slug))
    };
}

export const DemoItem = connect<{}, DispatchProps, OwnProps>(
    () => ({}),
    mapDispatchToProps
)(DemoItemComponent);
