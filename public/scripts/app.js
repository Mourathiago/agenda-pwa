const weatherApp = {
  selectedLocations: {},
  modal: document.getElementById('modal'),
};

function saveLocationList(locations) {
  const data = JSON.stringify(locations);
  localStorage.setItem('locationList', data);
}

function loadLocationList() {
  let locations = localStorage.getItem('locationList');
  if (locations) {
    try {
      locations = JSON.parse(locations);
    } catch (ex) {
      locations = {};
    }
  }
  if (!locations || Object.keys(locations).length === 0) {
    const key = '40.7720232,-73.9732319';
    locations = {};
    locations[key] = {label: 'New York City', geo: '40.7720232,-73.9732319'};
  }
  return locations;
}

/**
 * Modal
 */

$('#butAdd').click(function ()
{
  weatherApp.modal.classList.toggle('visible');
  let today = new Date();
  let dd = today.getDate(), mm = today.getMonth()+1, yyyy = today.getFullYear();
  dd = dd<10 ? '0'+dd : dd;
  mm = mm<10 ? '0'+mm : mm;
  today = yyyy+'-'+mm+'-'+dd;
  $('input[name=next]').attr('min', today);
});

$('#butDialogCancel').click(function ()
{
  weatherApp.modal.classList.toggle('visible');
});

$('#butDialogAdd').click(function ()
{
  weatherApp.modal.classList.toggle('visible');
});

/**
 * Tabs with JQuery
 */

$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

    if (e.type === 'keyup') {
      if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
      if( $this.val() === '' ) {
        label.removeClass('active highlight'); 
      } else {
        label.removeClass('highlight');   
      }   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
        label.removeClass('highlight'); 
      } 
      else if( $this.val() !== '' ) {
        label.addClass('highlight');
      }
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  $($(this).parent().siblings().find('a').attr('href')).removeClass('scroll');
  $($(this).attr('href')).addClass('scroll');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});