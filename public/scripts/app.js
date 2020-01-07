import { manager } from './manager.js';

const client = {
  modal: document.getElementById('modal'),
};

/**
 * Modal
 */

$('#butAdd').click(function ()
{
  client.modal.classList.toggle('visible');
  let today = new Date();
  let dd = today.getDate(), mm = today.getMonth()+1, yyyy = today.getFullYear();
  dd = dd<10 ? '0'+dd : dd;
  mm = mm<10 ? '0'+mm : mm;
  today = yyyy+'-'+mm+'-'+dd;
  $('input[name=next]').attr('min', today);
});

$('#butDialogCancel').click(function ()
{
  for(let i = 0; i < $('input').length; i++)
  {
    $($('input')[i]).val('');
  }
  client.modal.classList.toggle('visible');
});

$('#butDialogAdd').click(function ()
{
  let ok = 0;
  for(let i = 0; i < $('input').length; i++)
  {
    if($($('input')[i]).val() == 0)
    {
      ok = 1;
      break;
    }
  }
  if (ok == 0)
  {
    let data = {name: $('input[name=name]').val(), address: $('input[name=address]').val(), interval: $('input[name=interval]').val(), next: $('input[name=next]').val(), ativo: 1, adiado: '', atendido: 0};
    let aux = data.next.split('-');
    data.next = aux[2]+'/'+aux[1]+'/'+aux[0];
    for(let i = 0; i < $('input').length; i++)
    {
      $($('input')[i]).val('');
    }
    (async () =>
    {
        await manager
            .setDbName('clientes')
            .setDbVersion(1) 
            .register('clientes');
        await manager.save({ nome: 'clientes', data: data });
    })().catch(console.log);
    loadCliente();
    client.modal.classList.toggle('visible');
  }
  else
  {
    alert('Há campos que devem ser preenchidos');
  }
});

/**
 * Tabs with JQuery
 */

$('.form').find('input, textarea').on('keyup blur focus', function (e)
{
  let $this = $(this),
  label = $this.prev('label');
  if (e.type === 'keyup')
  {
    if ($this.val() === '')
    {
      label.removeClass('active highlight');
    }
    else
    {
      label.addClass('active highlight');
    }
  }
  else if (e.type === 'blur')
  {
    if( $this.val() === '' )
    {
      label.removeClass('active highlight'); 
    }
    else
    {
      label.removeClass('highlight');   
    }   
  }
  else if (e.type === 'focus')
  {
    if( $this.val() === '' )
    {
      label.removeClass('highlight'); 
    } 
    else if( $this.val() !== '' )
    {
      label.addClass('highlight');
    }
  }
});

$('.tab a').on('click', function (e)
{
  e.preventDefault();
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  $($(this).parent().siblings().find('a').attr('href')).removeClass('scroll');
  $($(this).attr('href')).addClass('scroll');
  target = $(this).attr('href');
  $('.tab-content > div').not(target).hide();
  $(target).fadeIn(600);
});


function loadCliente()
{
  (async () =>
  {
      await manager
          .setDbName('clientes')
          .setDbVersion(1) 
          .register('clientes');
      const value = await manager.list('clientes');
      let data = '';
      for(let x in value)
      {
        if (value[x].ativo == 0) {continue;}
        data += '<tr><td>'+value[x].name+'</td><td>'+value[x].address+'</td><td>'+value[x].next+'</td>';
        let aux = value[x].next.split('/');
        let date = new Date();
        let day = date.getDate(), month = date.getMonth()+1, year = date.getFullYear();
        if (value[x].atendido == 0 && (aux[0] >= day && aux[1] >= month && aux[2] >= year) || value[x].atendido == 0 && (aux[1] > month && aux[2] >= year))
        {
          data += '<td>Em aguarde</td>';
        }
        else if(value[x].atendido == 1 && (aux[0] >= day && aux[1] >= month && aux[2] >= year) || value[x].atendido == 1 && (aux[1] > month && aux[2] >= year))
        {
          data += '<td>Atendido</td>';
        }
        else
        {
          data += '<td>Data vencida</td>';
        }
        data += '<td><button>Atender</button></td><td><button>Adiar</button></td></tr>';
      }
      $('#cliente').html(data);
  })().catch(console.log);
}

loadCliente();