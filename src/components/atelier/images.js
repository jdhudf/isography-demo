import React, { Component } from 'react'

import Img1 from '../../images/materials/box.inline.svg';
import Img2 from '../../images/materials/monstera.inline.svg';
import Img3 from '../../images/materials/standing_man.inline.svg';
import Img4 from '../../images/materials/standing_woman.inline.svg';
import Img5 from '../../images/materials/moon.inline.svg';
import Img6 from '../../images/materials/man_on_screen.inline.svg';
import Img7 from '../../images/materials/antena.inline.svg';
import Img8 from '../../images/materials/pc.inline.svg';
import Img9 from '../../images/materials/keyboard.inline.svg';
import Img10 from '../../images/materials/tablet.inline.svg';
import Img11 from '../../images/materials/mobile.inline.svg';
import Img12 from '../../images/materials/tablet_vertical.inline.svg';
import Img13 from '../../images/materials/mobile_vertical.inline.svg';
import Img14 from '../../images/materials/editor.inline.svg';
import Img15 from '../../images/materials/clock.inline.svg';
import Img16 from '../../images/materials/eraser_2.inline.svg';
import Img17 from '../../images/materials/eraser.inline.svg';
import Img18 from '../../images/materials/measure_2.inline.svg';
import Img19 from '../../images/materials/measure.inline.svg';
import Img20 from '../../images/materials/pencil.inline.svg';
import Img21 from '../../images/materials/scissors.inline.svg';
import Img22 from '../../images/materials/code.inline.svg';
import Img23 from '../../images/materials/pc_browser.inline.svg';
import Img24 from '../../images/materials/pc_browser_horizontal.inline.svg';
import Img25 from '../../images/materials/book.inline.svg';
import Img26 from '../../images/materials/book_2.inline.svg';
import Img27 from '../../images/materials/magnifier.inline.svg';
import Img28 from '../../images/materials/magnifier_2.inline.svg';
import Img29 from '../../images/materials/magnifier_3.inline.svg';
import Img30 from '../../images/materials/wheel.inline.svg';
import Img31 from '../../images/materials/wheel_2.inline.svg';
import Img32 from '../../images/materials/ladder.inline.svg';
import Img33 from '../../images/materials/standing_man_2.inline.svg';
import Img34 from '../../images/materials/paper_1.inline.svg';
import Img35 from '../../images/materials/paper_2.inline.svg';

import Img36 from '../../images/materials/paper_3.inline.svg';
import Img37 from '../../images/materials/paper_4.inline.svg';
import Img38 from '../../images/materials/paper_5.inline.svg';
import Img39 from '../../images/materials/paper_6.inline.svg';
import Img40 from '../../images/materials/mechanical_pencil.inline.svg';

import Img41 from '../../images/materials/coaster_square.inline.svg';
import Img42 from '../../images/materials/coaster_circle.inline.svg';
import Img43 from '../../images/materials/cup_1.inline.svg';
import Img44 from '../../images/materials/cup_2.inline.svg';

import Img45 from '../../images/materials/ginkgo_1.inline.svg';
import Img46 from '../../images/materials/ginkgo_2.inline.svg';
import Img47 from '../../images/materials/ginkgo_3.inline.svg';
import Img48 from '../../images/materials/ginkgo_4.inline.svg';
import Img49 from '../../images/materials/ginkgo_5.inline.svg';
import Img50 from '../../images/materials/ginkgo_6.inline.svg';

import Img51 from '../../images/materials/maple1_1.inline.svg';
import Img52 from '../../images/materials/maple1_2.inline.svg';
import Img53 from '../../images/materials/maple1_3.inline.svg';
import Img54 from '../../images/materials/maple1_4.inline.svg';

import Img55 from '../../images/materials/maple2_1.inline.svg';
import Img56 from '../../images/materials/maple2_2.inline.svg';
import Img57 from '../../images/materials/maple2_3.inline.svg';
import Img58 from '../../images/materials/maple2_4.inline.svg';

import Img59 from '../../images/materials/maple3_1.inline.svg';
import Img60 from '../../images/materials/maple3_2.inline.svg';
import Img61 from '../../images/materials/maple3_3.inline.svg';
import Img62 from '../../images/materials/maple3_4.inline.svg';

import Img63 from '../../images/materials/simeji_1.inline.svg';
import Img64 from '../../images/materials/simeji_2.inline.svg';

import Img65 from '../../images/materials/shiitake_1.inline.svg';
import Img66 from '../../images/materials/shiitake_2.inline.svg';

import Img67 from '../../images/materials/duck_doll.inline.svg';
import Img68 from '../../images/materials/tortoise_doll.inline.svg';

import Img69 from '../../images/materials/chair1_1.inline.svg';
import Img70 from '../../images/materials/chair1_2.inline.svg';

import Img71 from '../../images/materials/bench.inline.svg';
import Img72 from '../../images/materials/working_chair.inline.svg';
import Img73 from '../../images/materials/working_chair_2.inline.svg';

import Img74 from '../../images/materials/paper_on_wall_1.inline.svg';
import Img75 from '../../images/materials/paper_on_wall_2.inline.svg';
import Img76 from '../../images/materials/paper_on_wall_3.inline.svg';

import Img77 from '../../images/materials/small_note_1.inline.svg';
import Img78 from '../../images/materials/small_note_2.inline.svg';

import Img79 from '../../images/materials/bench_2.inline.svg';
import Img80 from '../../images/materials/sofa_1_1.inline.svg';
import Img81 from '../../images/materials/sofa_1_2.inline.svg';
import Img82 from '../../images/materials/sofa_2_1.inline.svg';
import Img83 from '../../images/materials/sofa_2_2.inline.svg';
import Img84 from '../../images/materials/sofa_3_1.inline.svg';
import Img85 from '../../images/materials/sofa_3_2.inline.svg';

import Img86 from '../../images/materials/book_1_1.inline.svg';
import Img87 from '../../images/materials/book_1_2.inline.svg';
import Img88 from '../../images/materials/book_2_1.inline.svg';
import Img89 from '../../images/materials/book_2_2.inline.svg';

import Img90 from '../../images/materials/file_book_1.inline.svg';

import Img91 from '../../images/materials/bar_chart_1.inline.svg';
import Img92 from '../../images/materials/circle_chart_1.inline.svg';
import Img93 from '../../images/materials/floor_1_1.inline.svg';
import Img94 from '../../images/materials/floor_1_2.inline.svg';

import Img95 from '../../images/materials/wall_clock_1.inline.svg';
import Img96 from '../../images/materials/desk_1.inline.svg';
import Img97 from '../../images/materials/aroma_diffuser_1.inline.svg';
import Img98 from '../../images/materials/pillow_1_1.inline.svg';
import Img99 from '../../images/materials/duck_foot_print.inline.svg';
import Img100 from '../../images/materials/duck_doll_1.inline.svg';



class Myloop extends Component {

  render() {

    return (
      <>
        <div className="item"><Img1/></div>
        <div className="item"><Img2/></div>
        <div className="item"><Img3/></div>
        <div className="item"><Img4/></div>
        <div className="item"><Img33/></div>
        <div className="item"><Img5/></div>
        <div className="item"><Img6/></div>
        <div className="item"><Img7/></div>
        <div className="item"><Img8/></div>
        <div className="item"><Img9/></div>
        <div className="item"><Img10/></div>
        <div className="item"><Img11/></div>
        <div className="item"><Img12/></div>
        <div className="item"><Img13/></div>
        <div className="item"><Img14/></div>
        <div className="item"><Img15/></div>
        <div className="item"><Img16/></div>
        <div className="item"><Img17/></div>
        <div className="item"><Img18/></div>
        <div className="item"><Img19/></div>
        <div className="item"><Img20/></div>
        <div className="item"><Img21/></div>
        <div className="item"><Img22/></div>
        <div className="item"><Img23/></div>
        <div className="item"><Img24/></div>
        <div className="item"><Img25/></div>
        <div className="item"><Img26/></div>
        <div className="item"><Img27/></div>
        <div className="item"><Img28/></div>
        <div className="item"><Img29/></div>
        <div className="item"><Img30/></div>
        <div className="item"><Img31/></div>
        <div className="item"><Img32/></div>
        <div className="item"><Img34/></div>
        <div className="item"><Img35/></div>
        <div className="item"><Img36/></div>
        <div className="item"><Img37/></div>
        <div className="item"><Img38/></div>
        <div className="item"><Img39/></div>
        <div className="item"><Img40/></div>
        <div className="item"><Img41/></div>
        <div className="item"><Img42/></div>
        <div className="item"><Img43/></div>
        <div className="item"><Img44/></div>
        <div className="item"><Img45/></div>
        <div className="item"><Img46/></div>
        <div className="item"><Img47/></div>
        <div className="item"><Img48/></div>
        <div className="item"><Img49/></div>
        <div className="item"><Img50/></div>
        <div className="item"><Img51/></div>
        <div className="item"><Img52/></div>
        <div className="item"><Img53/></div>
        <div className="item"><Img54/></div>
        <div className="item"><Img55/></div>
        <div className="item"><Img56/></div>
        <div className="item"><Img57/></div>
        <div className="item"><Img58/></div>
        <div className="item"><Img59/></div>
        <div className="item"><Img60/></div>
        <div className="item"><Img61/></div>
        <div className="item"><Img62/></div>
        <div className="item"><Img63/></div>
        <div className="item"><Img64/></div>
        <div className="item"><Img65/></div>
        <div className="item"><Img66/></div>
        <div className="item"><Img67/></div>
        <div className="item"><Img68/></div>
        <div className="item"><Img69/></div>
        <div className="item"><Img70/></div>
        <div className="item"><Img71/></div>
        <div className="item"><Img72/></div>
        <div className="item"><Img73/></div>
        <div className="item"><Img74/></div>
        <div className="item"><Img75/></div>
        <div className="item"><Img76/></div>
        <div className="item"><Img77/></div>
        <div className="item"><Img78/></div>
        <div className="item"><Img79/></div>
        <div className="item"><Img80/></div>
        <div className="item"><Img81/></div>
        <div className="item"><Img82/></div>
        <div className="item"><Img83/></div>
        <div className="item"><Img84/></div>
        <div className="item"><Img85/></div>
        <div className="item"><Img86/></div>
        <div className="item"><Img87/></div>
        <div className="item"><Img88/></div>
        <div className="item"><Img89/></div>
        <div className="item"><Img90/></div>
        <div className="item"><Img91/></div>
        <div className="item"><Img92/></div>
        <div className="item"><Img93/></div>
        <div className="item"><Img94/></div>
        <div className="item"><Img95/></div>
        <div className="item"><Img96/></div>
        <div className="item"><Img97/></div>
        <div className="item"><Img98/></div>
        <div className="item"><Img99/></div>
        <div className="item"><Img100/></div>





      </>
    );
  }
}
export default Myloop
