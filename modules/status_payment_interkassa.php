<?php

if(!defined("QEXY")){ exit("Hacking Attempt!"); }

class module{
	public $cfg, $core, $db;

	public function __construct($core){
		$this->core = $core;
		$this->cfg = $core->cfg;
		$this->db = $core->db;
	}

	private function dump($var){
		ob_start();

		var_dump($var);

		return ob_get_clean();
	}

	private function notify($message, $type=false){

		$result = ($type) ? "result" : "error";
		$result_data = ($type) ? array("message" => $message) : array("code" => -32000, "message" => $message);

		$array = array(
			"jsonrpc" => "2.0",
			$result => $result_data,
			'id' => 1
		);
		
		return json_encode($array);
	}

	private function getMd5Sign($params, $secretKey){
	    
	    $dataSet = $params;
	    unset($dataSet['ik_sign']); 
        ksort($dataSet, SORT_STRING);
        array_push($dataSet, $secretKey);
        $signString = implode(':', $dataSet);
        return base64_encode(md5($signString, true));


	}

	private function up_status(){

		if(!isset($_GET['ik_sign'])){ return $this->notify("Hacking Attempt!"); }
        
        $params = @$_GET;
        unset($params['do']);
		$id = intval(@$params['ik_pm_no']);

		$sum = floatval(@$params['ik_am']);
		$time = time();

		$sign = @$params['ik_sign'];
        
		$query	= $this->db->query("SELECT `t`.iid, `t`.login, `i`.`type`, `i`.`value`, `i`.`amount`
									FROM `qx_trans` AS `t`
									INNER JOIN `qx_items` AS `i`
										ON `i`.id=`t`.iid
									WHERE `t`.id='$id' AND `t`.`status`='0' AND `t`.`sum`='$sum'");

		if(!$query || $this->db->num_rows($query)<=0){ 
		    return $this->notify("Счет не найден #pay"); }

		$ar		= $this->db->fetch_assoc($query);

		$login	= $this->db->safesql($ar['login']);
		$value	= $this->db->safesql($ar['value']);
		$type	= $this->db->safesql($ar['type']);
		$amount	= intval($ar['amount']);

		$createsign = $this->getMd5Sign($params, $this->cfg['up_secret_interkassa']);

		if($sign!==$createsign){ return $this->notify("Ошибка хэш-суммы платежа"); }

		$update_trans = $this->db->query("UPDATE `qx_trans`
										SET `time`='$time', `status`='1'
										WHERE id='$id' AND `status`='0'");

		if(!$update_trans){ return $this->notify("Ошибка запроса #1"); }

		$insert = $this->db->query("INSERT INTO `shopcart`
										(`type`, `item`, `player`, `amount`)
									VALUES
										('$type', '$value', '$login', '$amount')");

		if(!$insert){ return $this->notify("Ошибка запроса #2"); }

		return $this->notify("Оплата прошла успешно", true);
	}
	


	public function content(){

		$do = $_GET['do'];

		switch($do){

			case 'up_status_interkassa':
				echo $this->up_status();
				exit;
			break;

			default: exit('Hacking Attempt'); break;
		}
	}
}


?>