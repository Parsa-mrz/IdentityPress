<?php
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

	/**
	 * Automatically boot PHP classes in the given folders up to a defined recursion depth.
	 *
	 * Scans directories recursively (up to 5 levels deep by default), discovers PHP files,
	 * and instantiates classes if they exist.
	 *
	 * @since 1.0.0
	 *
	 * @param array<int, string> $folders List of backend folder names to scan.
	 * @param int                $max_depth Maximum recursion depth (default 5).
	 *
	 * @return void
	 */
	private function auto_boot( array $folders, int $max_depth = 5 ): void {
		foreach ( $folders as $folder ) {
			$base_dir       = IDENTITY_PRESS_PLUGIN_DIR . '/app/Backend/' . $folder . '/';
			$base_namespace = "App\\$folder";

			if ( ! is_dir( $base_dir ) ) {
				continue;
			}

			$this->scan_directory( $base_dir, $base_namespace, $max_depth );
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
	}
}
