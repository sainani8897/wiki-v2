// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Col, Nav, Row } from 'rsuite';
import BasicForm from './Basic';
import PageContent from '@/components/PageContent';
import {VscBook,VscVariableGroup} from 'react-icons/vsc';
import NewCourseBuilder from './NewCourseBuilder';

const CustomNav = ({ active, activeLevel, onSelect, ...props }) => {
    return (
        <Nav {...props} vertical activeKey={active} onSelect={onSelect} style={{ width: 100 }}>
            <Nav.Item eventKey="course" icon={<VscBook />}>
                Course
            </Nav.Item>
            <Nav.Item eventKey="builder" disabled={(activeLevel >= 0)} icon={<VscVariableGroup/>}>Builder</Nav.Item>
        </Nav>
    );
};

const Builder = (activeLevel = 1) => {
    const [active, setActive] = React.useState('course');
    //   const [activeKey, setActiveKey] = useState('home'); // State to track active tabe

    const renderTabContent = () => {
        switch (active) {
            case 'course':
                return <BasicForm />;
            default:
                return <NewCourseBuilder/>;
        }
    };

    return (
        <>
            <PageContent>
                {/* <CustomNav appearance="subtle" active={active} onSelect={setActive} /> */}
                <Row>
                    <Col md={4}>
                        <CustomNav appearance="subtle" activeLevel={activeLevel} active={active} onSelect={setActive} />
                    </Col>

                    <Col md={12}>
                        {renderTabContent()}
                    </Col>
                </Row>
                
            </PageContent>
        </>
    );
};

export default Builder;