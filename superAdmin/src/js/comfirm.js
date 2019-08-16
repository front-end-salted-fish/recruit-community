import $ from '../../lib/jquery-1.12.4.min';
const $comfirmFrame = $('.alert ');
const $closeComfirmFrameBtn = $('.alert .close');
const $cancelBtn = $('.alert .cancel');
$closeComfirmFrameBtn.on('click', function() {
    $comfirmFrame.hide();
});
$cancelBtn.on('click', function() {
    $comfirmFrame.hide();
});
export {$comfirmFrame};