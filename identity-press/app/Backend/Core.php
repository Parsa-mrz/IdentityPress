<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
/**
 * The core functionality of the plugin.
 *
 * @link       https://parsamirzaie.com
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend
 */

namespace App\Backend;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The main core class of the plugin.
 *
 * This class is responsible for bootstrapping the plugin, defining the main
 * structures, loading text domains, and initializing other components.
 *
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend
 */
class Core {
	/**
	 * The single instance of the class.
	 *
	 * @var Core|null
	 */
	private static ?Core $instance = null;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Get the single instance of the class
	 *
	 * @return Core
	 */
	public static function get_instance(): Core {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function auto_boot( int $max_depth = 5 ): void {
		$backend_dir = IDENTITY_PRESS_PLUGIN_DIR . '/app/Backend/';
		$folders     = glob( $backend_dir . '*', GLOB_ONLYDIR );

		if ( ! is_array( $folders ) ) {
			return;
		}

		$skip_folders = array( 'Models', 'Enums', 'Widgets', 'Views', 'DTOs', 'Repositories' );

		foreach ( $folders as $folder_path ) {
			$folder = basename( $folder_path );

			if ( in_array( $folder, $skip_folders, true ) ) {
				continue;
			}

			$base_namespace = "App\\Backend\\$folder";

			$this->scan_directory( $folder_path . '/', $base_namespace, $max_depth );
		}
	}

	/**
	 * Recursively scans a directory and instantiates PHP classes.
	 *
	 * @since 1.0.0
	 *
	 * @param string $dir       The directory to scan.
	 * @param string $base_namespace The base namespace for discovered classes.
	 * @param int    $depth          Remaining recursion depth.
	 *
	 * @return void
	 */
	private function scan_directory( string $dir, string $base_namespace, int $depth ): void {
		if ( $depth <= 0 ) {
			return;
		}

		$skip_folders = array( 'Models', 'Enums', 'Widgets', 'Views', 'DTOs', 'Repositories' );
		$files        = glob( $dir . '*.php' );

		foreach ( $files as $file ) {
			$class_name = $base_namespace . '\\' . basename( $file, '.php' );

			if ( ! class_exists( $class_name ) ) {
				continue;
			}

			try {
				$reflection = new \ReflectionClass( $class_name );

				if ( ! $reflection->isInstantiable() ) {
					continue;
				}

				new $class_name();
			} catch ( \ReflectionException $e ) {
				continue;
			}
		}

		$sub_dirs = glob( $dir . '*/', GLOB_ONLYDIR );
		foreach ( $sub_dirs as $sub_dir ) {
			if ( in_array( basename( $sub_dir ), $skip_folders, true ) ) {
				continue;
			}

			$sub_namespace = $base_namespace . '\\' . basename( $sub_dir );
			$this->scan_directory( $sub_dir, $sub_namespace, $depth - 1 );
		}
	}

	/**
	 * Fires the main core loaded hook.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function run(): void {
		$this->auto_boot();
	}
}
