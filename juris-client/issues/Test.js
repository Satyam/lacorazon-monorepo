import juris from '@src/jurisInstance.js';

juris.registerComponent('TestChild', ({ id, value }, { newState }) => {
  const [getSomething, setSomething] = newState('something');
  setSomething(id);
  return {
    render: () => ({
      li: {
        key: id,
        text: `${id}: ${value}, ${getSomething()}`,
      },
    }),
    api: {
      getId: () => id,
      getValue: () => value,
      getNewState: () => getSomething(),
    },
  };
});

const records = ['a', 'b', 'c', 'd', 'e', 'f'];

juris.registerComponent('Test', (props, { components }) => {
  return {
    render: () => {
      return {
        div: {
          children: [
            {
              ul: {
                children: records.map((value, id) => ({
                  TestChild: { id, value },
                })),
              },
            },
            {
              button: {
                text: 'click!',
                onclick: () =>
                  console.log(
                    [
                      components.getComponentAPI('TestChild').getId(),
                      components.getComponentAPI('TestChild').getValue(),
                      components.getComponentAPI('TestChild').getNewState(),
                      JSON.stringify(
                        juris.stateManager.state['##local'],
                        null,
                        2
                      ),
                    ].join('\n')
                  ),
              },
            },
          ],
        },
      };
    },
  };
});
