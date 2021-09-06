export const handleElement = ({ action, svg_data, selected}) => {

    const data_copy = svg_data.slice();

    for (var i = 0; i < selected.length; i++) {

      const el = data_copy[ selected[i] ];

      switch (action) {
        case 'Duplicate':
          console.log('duplicate');
          data_copy.push(el);
          break;
        case 'Delete':
          console.log('delete');
          data_copy.splice(selected[i],1);

          break;
        case 'Reflect':
          const regExp = /-?\d+/g;
          const scale = el.match(regExp)

          let n = 3;

          const result = el.replace(regExp,
            function(match) {
              if(n === 3) {
                n--;
                return scale[0];
              } else if (n === 2) {
                n--;
                return scale[1];
              } else if (n === 1) {
                n--;
                return -scale[2];
              } else if (n === 0) {
                n--;
                return scale[3];
              } else {
                return match;
              };
            }
          );


          data_copy.splice(selected[i],1);
          data_copy.push(result);
          break;
        case 'bringToFront':
          console.log('bringToFront');
          data_copy.splice(selected[i],1);
          data_copy.push(el);

          break;
        case 'bringForward':
          console.log('bringForward');
          data_copy.splice(selected[i],1);
          data_copy.splice(selected[i] + 1 ,0,el);

          break;
        case 'sendBackward':
          console.log('sendBackward');
          data_copy.splice(selected[i],1);
          data_copy.splice(selected[i] - 1 ,0,el);
          break;
        case 'sendToBack':
          console.log('sendToBack');
          data_copy.splice(selected[i],1);
          data_copy.unshift(el);
          break;
        default:
          break;
      }

    }

    return data_copy

};
