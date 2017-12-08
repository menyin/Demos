/**
 * Created by PC on 2017/12/7.
 */
/*回到顶部效果*/
if(!jpjs){
    $(document).ready(function(){
        factory($);
    });
} else {
    jpjs.use(factory);
}
function factory($){
    $(window).scroll(function(){
        if ($(document).scrollTop() > 120){
            $('#sus').find('a.backTop').css({'display':'inline-block'});
        }else{
            $('#sus').find('a.backTop').css({'display':'none'});
        }
    });
    $('#sus').find('a.backTop').click(function(){
        $('html,body').animate({ scrollTop: 0 });
    });

    var searchWord = '{$keyword}';
    if(searchWord!=''){
        $('.search_box_a em').css('visibility','visible');
    }

    $('.search_box_a .searchInput #searchInput').keyup(function(){
        if($(this).val()!=''){
            $('.search_box_a em').css('visibility','visible');
        }else{
            $('.search_box_a em').css('visibility','hidden');
        }
    });
    $('.search_box_a em').click(function(){
        $(this).closest('div').find('#searchInput').val('');
        $('.search_box_a em').css('visibility','hidden');
        $(this).closest('div').find('#searchInput').focus();
    })
}