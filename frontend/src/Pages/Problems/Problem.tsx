import { Tabs } from "antd";
import type { TabsProps } from "antd";
import AllProblems from "./AllProblems/AllProblems";

const Problem = () => {
    const handleTabChange: TabsProps['onChange'] = (key) => {
        console.log(`Selected Tab: ${key}`);
    }
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'All Topics',
            children: <AllProblems />,
        },
        {
            key: '2',
            label: 'Algorithms',
            children: 'Content of Tab Pane 2',
        },
        {
            key: '3',
            label: 'Database',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '4',
            label: 'Shell',
            children: 'Content of Tab Pane 4',
        },
        {
            key: '5',
            label: 'Concurrency',
            children: 'Content of Tab Pane 5',
        },
        {
            key: '6',
            label: 'JavaScript',
            children: 'Content of Tab Pane 6',
        },
        {
            key: '7',
            label: 'Pandas',
            children: 'Content of Tab Pane 7',
        },
    ];





    return (
        <div className="h-screen ">
            <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={handleTabChange}
                className="w-1/2 m-auto"
            />
        </div>

    )
}

export default Problem
