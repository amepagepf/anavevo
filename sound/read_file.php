<?php
  header('Access-Control-Allow-Origin: https://anareo.cloud.pf');

  define('SYM_KEY', '8d4454a0e831b3df6e7422fdd22254d5');
  define('BRUT_DIR','/var/www/sound/upload_brut/');
  define('OGG_DIR','/var/www/sound/upload_ogg/');
  date_default_timezone_set('Pacific/Tahiti');

  $ip = null;

  if(isset($_SERVER['REMOTE_ADDR'])) {
    $ip = $_SERVER['REMOTE_ADDR'];
  }

  if(isset($_GET['action'])){
    if($_GET['action']==='read_file'){
      echo read_file();
    }
  }

  function read_log($date,$infos, $motif_echec=null) {
  global $ip;
  $log_dir = '/var/www/sound/log/';
  $log_file_name = $date->format('Y_m_d');
  $log_to_write = $infos!=null ?
   $date->format('Y-m-d  H:i:s').' ; file_id='.$infos['file_id'].' ; id session='.$infos['id_session'].' ; date de creation du lien='.$infos['date'].' ; md5='.$infos['md5'].' ; ip='.$ip :
     $date->format('Y-m-d  H:i:s').' ; ip='.$ip;
  if ($motif_echec!==null) {
    $log_to_write.=' ; echec ; ';
    if($motif_echec == 'parametre_info_manquant') {
      $log_to_write.= 'le parametre get "infos" est manquant';
    } elseif ($motif_echec == 'expire') {
      $log_to_write.= "le lien n'est plus valide";
    } elseif ($motif_echec == 'md5') {
      $log_to_write.= "mauvaise cle de hash";
    } elseif ($motif_echec == 'fopen') {
      $log_to_write.= "erreur fopen";
    } elseif ($motif_echec == 'fclose') {
      $log_to_write.= "erreur fclose";
    } elseif ($motif_echec == 'fread') {
      $log_to_write.= "erreur fread";
    }

  } else {
    $log_to_write.=' ; succes';
  }
  $log_to_write.="\n";

  $f_open = fopen($log_dir.$log_file_name,'a+');
  if(!$f_open) {
    http_response_code(500);
    exit;
  }
  $f_write = fwrite($f_open,$log_to_write);
  if(!$f_write) {
    http_response_code(500);
    exit;
  }
  $f_close = fclose($f_open);
  if(!$f_close) {
    http_response_code(500);
    exit;
  }
}

  function nom_dossier_avec_zeros($p_file_id) {
    $p_file_id_int = intval($p_file_id);
    $i=0;
    while($p_file_id_int>10000 && $i<40) {
      $p_file_id_int -= 10000;
      $i++;
    }
    $i_str = strval($i);
    $nb_zeros_a_rajouter = 10 - strlen($i_str);
    $zeros='';
    for($j=0;$j<$nb_zeros_a_rajouter;$j++){
      $zeros.='0';
    }
    $nom_dossier = $zeros.$i_str;
    return $nom_dossier;
  }

  function nom_fichier_avec_zeros($p_file_id){
    $nb_zeros_a_rajouter_fichier = 10 - strlen(strval($p_file_id));
    $zeros_fichier = '';
    for($w=0;$w<$nb_zeros_a_rajouter_fichier;$w++) {
        $zeros_fichier.='0';
      }
    $nom_fichier = $zeros_fichier.$p_file_id;
    return $nom_fichier;
  }

  function read_file() {
      date_default_timezone_set('Pacific/Tahiti');
      $file_id=-1;
      if(isset($_GET['infos']) ) {
        $infos  = base64_decode($_GET['infos']);
        $infos_j = json_decode($infos, true);
        $file_id = $infos_j['file_id'];
        $id_session = $infos_j['id_session'];
        $date = $infos_j['date'];
        error_log($date);

        $temps = strtotime("now")-strtotime($date);
        $md5_client = $infos_j['md5'];
        $md5_serveur = md5($id_session.$file_id.$date.SYM_KEY);

        $date_limite = new DateTime($date);
        $date_limite->add(new DateInterval('PT2H'));

        $now = new DateTime();

        if($md5_client==$md5_serveur && $now<$date_limite) {
          $headers = getallheaders();
          $file_path_ogg = OGG_DIR;
          $nom_dossier = nom_dossier_avec_zeros($file_id);
          $nom_fichier = nom_fichier_avec_zeros($file_id);

          if($infos_j['ogg'] == 'false') {
            $upload_dir_path = BRUT_DIR;
            $upload_dir_path=$upload_dir_path.$nom_dossier.'/';
            $file_path_ok = $upload_dir_path.$nom_fichier.'.ok';
            $file_content = file_get_contents($file_path_ok);
            echo base64_encode($file_content);
            exit;
          }


          $file_path_ogg.=$nom_dossier.'/'.$nom_fichier.'.ogg';

          $file_path_ogg_ok = OGG_DIR.$nom_dossier.'/'.$nom_fichier.'.ogg.ok';

          $file=$file_path_ogg;

          if(!file_exists($file)){
            $file = $file_path_ogg_ok;
            if(!file_exists($file)) {
              return;
            }
          }
          // error_log($file);
              $fp = @fopen($file, 'rb');
              if($fp===false) {
                read_log($now,$infos_j, 'fopen');
                error_log('err fopen');
                http_response_code(500);
                exit;
              }
              read_log($now,$infos_j);
              $size   = filesize($file); // File size
              $length = $size;           // Content length
              $start  = 0;               // Start byte
              $end    = $size - 1;       // End byte
              $finfo = finfo_open(FILEINFO_MIME_TYPE);
              $mime_type = finfo_file($finfo, $file);
              header('Content-type: '.$mime_type);
              header("Accept-Ranges: 0-$length");
              header("Accept-Ranges: bytes");
              if (isset($_SERVER['HTTP_RANGE'])) { //Ex: $_SERVER['HTTP_RANGE'] = bytes=983040-
                error_log($_SERVER['HTTP_RANGE']);
                  $c_start = $start;
                  $c_end   = $end;
                  list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
                  if (strpos($range, ',') !== false) {
                      header('HTTP/1.1 416 Requested Range Not Satisfiable');
                      header("Content-Range: bytes $start-$end/$size");
                      exit;
                  }
                  if ($range == '-') {
                      $c_start = $size - substr($range, 1);
                  } else {
                      $range  = explode('-', $range);
                      $c_start = $range[0];
                      $c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
                  }
                  $c_end = ($c_end > $end) ? $end : $c_end;
                  if ($c_start > $c_end || $c_start > ($size-1) || $c_end >= $size ) {
                    header('HTTP/1.1 416 Requested Range Not Satisfiable');
                    header("Content-Range: bytes $this->start-$this->end/$this->size");
                    exit;
                  }
                  $start = $c_start;
      					  $end = $c_end;
      					  $length = $end - $start + 1;
      					  fseek($fp, $start);
      					  header('HTTP/1.1 206 Partial Content');
      					  header("Content-Length: ".$length);
      					  header("Content-Range: bytes $start-$end/".$size);
            } else {
              header("Content-Length: ".$size);
            }
            $buffer = 102400;
            $i=$start;
            while(!feof($fp) && $i <= $end) {
    					 $bytesToRead = $buffer;
    					 if(($i+$bytesToRead) > $end) {
    							 $bytesToRead = $end - $i + 1;
    					 }
    					 $data = fread($fp, $bytesToRead);
    					 echo $data;
    					 flush();
    					 $i += $bytesToRead;
    			 }

           fclose($fp);
		       exit;

          }
          else {
            http_response_code(403);
            exit;
          }
        }

}
