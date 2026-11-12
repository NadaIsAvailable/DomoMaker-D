const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const teethNum = e.target.querySelector('#domoTeethNum').value;

    if (!name || !age || !teethNum) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, teethNum }, onDomoAdded);
    return false;
};

const handleDelete = (url, data, onDomoDeleted) => {
    helper.hideError();

    if (!data.name || !data.age || !data.teethNum || !data.createdDate) {
        helper.handleError('Broken data! Cannot delete!');
        return;
    }

    helper.sendDelete(url, { ...data }, onDomoDeleted);
};

const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name='domoForm'
            action='/maker'
            method='POST'
            className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name'></input>

            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min='0' name='age'></input>

            <label htmlFor='teethNum'>Number of teeth: </label>
            <input id='domoTeethNum' type='number' min='0' name='teethNum'></input>

            <input className='makeDomoSubmit' type='submit' value='Make Domo'></input>
        </form>
    )
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className='domo'>
                <div className='domoProfile'>
                    <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace'></img>
                    <button className='deleteDomo' 
                        onClick={() => handleDelete('/domo', domo, props.triggerReload)}
                    >Delete</button>
                </div>
                <div className='domoInfo'>
                    <h3 className='domoName'>Name: {domo.name}</h3>
                    <h3 className='domoAge'>Age: {domo.age}</h3>
                    <h3 className='domoTeethNum'>Number of teeth: {domo.teethNum}</h3>
                </div>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id='makeDomo'>
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id='domos'>
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;