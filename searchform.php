<?php
/**
 * The template for displaying the search form.
 *
 * @package _s
 */

?>
<form method="get" class="input-group search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <span class="input-group-label show-for-sr"><?php esc_html_e( 'To search this site, enter a search term', '_s' ) ?></span>
  <input class="input-group-field"id="search-field" type="text" name="s" value="<?php echo get_search_query() ?>" aria-required="false" autocomplete="off" placeholder="<?php echo esc_attr_x( 'Search', '_s' ) ?>" />
  <div class="input-group-button">
    <input type="submit" class="button" value="<?php echo esc_attr_x( 'Submit', '_s' ); ?>">
  </div>
</form>