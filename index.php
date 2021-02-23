<?php

ini_set('display_errors', false);
error_reporting(0);

session_start();

header('Content-Type: text/html; charset=UTF-8');

require_once('config.php');

define("QEXY", true);
define("DIR_ROOT", dirname(__FILE__).'/');
define("DIR_ENGINE", DIR_ROOT.'engine/');
define("DIR_MODULES", DIR_ROOT.'modules/');
define("DIR_UPLOADS", DIR_ROOT.'uploads/');
define("DIR_THEMES", DIR_ROOT.'themes/'.$cfg['theme'].'/');
define("URL_ROOT", $cfg['s_url']);
define("URL_ROOT_FULL", $cfg['s_url_full']);
define("URL_ADMIN", URL_ROOT."?do=admin");
define("URL_THEMES", URL_ROOT.'themes/'.$cfg['theme'].'/');
define("URL_UPLOADS", URL_ROOT."uploads/");

require_once(DIR_ENGINE.'core.class.php');

$core = new core($cfg);



$do = (isset($_GET['do'])) ? $_GET['do'] : 'main';

//$core->check_secure();

//$secure = $core->set_secure();

switch($do){
	case 'main':
	case 'cp':
	case 'static':
	case 'ajax':
		$content = $core->load_mod($do);
	break;

	case 'up_status_interkassa': $content = $core->load_mod('status_payment_interkassa'); break;
	
	case 'up_status': $content = $core->load_mod('status'); break;

	default: $content = $core->sp(DIR_THEMES.'html/statics/404.html'); break;
}

$info = $core->get_info();

include_once(DIR_THEMES.'global.html');

?>