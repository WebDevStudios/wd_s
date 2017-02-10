<?php
/**
 * Enable multiple WYSIWYG editors in the theme customizer.
 *
 * @package _s
 */

if ( class_exists( 'WP_Customize_Control' ) ) :

	/**
	 * Class to create a custom text editor control
	 */
	class WDSMultipleTinyMceSupport extends WP_Customize_Control {

		/**
		 * Keep track of how many editors are added.
		 *
		 * @var integer
		 */
		protected static $count = 0;

		/**
		 * Render the content on the theme customizer page
		 *
		 * @return  void
		 */
		public function render_content() {
			?>
			<label>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
				<span class="description customize-control-description"><?php echo esc_html( $this->description ); ?></span>
			</label>
			<div class="wds-customize-text-editor">
			<?php
			// Register the editor.
			wp_editor( $this->value(), $this->id, array(
				'textarea_name' => $this->id,
				'textarea_rows' => 4,
				'media_buttons' => true,
			) );

			// Add the footer scripts.
			$this->add_footer_scripts();

			// Increment count.
			++self::$count;
			?>
			</div>
			<?php
		}

		/**
		 * Add footer scripts for the tinymce.
		 */
		protected function add_footer_scripts() {
			do_action( 'admin_print_footer_scripts' );
		}
	}
endif;
